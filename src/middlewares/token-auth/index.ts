/**
 * @description token权限校验
 * @author chen
 * @update 2021-01-21 14:23:03
*/

import Koa from 'koa'
import BasicAuth from 'basic-auth'
import JWT from 'jsonwebtoken'
import { clientSet, clientGet, clientDel } from '../redis'
import { decrypt } from '../../utils/crypto'

/**
 * 不校验路由集合
*/
let unlessPath: string[] = []

/**
 * token拦截中间件
*/
export function TokenAuth(unlessList: string[]) {
  unlessPath = unlessList
  return async (ctx: Koa.Context, next: any) => {
    let flag: number = 1 // 0 不校验 1 普通路由校验 2 静态资源权限校验
    let path = getPath(ctx.request.url)
    if (path.startsWith('/files/') || path.startsWith('/images/') || path.startsWith('/editors/')) { // 静态资源校验权限
      flag = 2
      const { query } = require('../../db')
      let lastIndex = path.lastIndexOf('/')
      let filePath = path.substring(lastIndex + 1)
      let sql = 'SELECT is_login as isLogin, secret, create_user as createUser FROM files_info WHERE file_path = ?'
      const res = await query(sql, filePath)
      if (res.length) {
        let file = res[0]
        await TokenVerifyStatic(ctx, file)
      } else {
        throw new global.ExceptionNotFound()
      }
    } else if (path.startsWith('favicon')) {
      flag = 0
    } else {
      unlessPath.find(val => {
        if (path === val) {
          flag = 0
          return true
        }
      })
    }
    if (flag === 1) { // 普通接口校验
      const tokenData: any = await TokenVerify(ctx)
      if (tokenData.code !== global.Code.success)
        throw new global.ExceptionHttp(tokenData)
      ctx.user = tokenData.data
    }
    await next()
  }
}

/**
 * 普通路由校验方法
 * 校验 token 合法性 普通接口请求拦截
*/
export async function TokenVerify(ctx: Koa.Context) {
  const tokenOrigin = BasicAuth(ctx.req)
  if (!tokenOrigin || !tokenOrigin.name) {
    return { message: 'token不存在', code: global.Code.forbidden }
  }
  const token = tokenOrigin.name
  const tokenInfo: any = JWT.decode(token)
  try {
    let terminal = global.tools.getTerminal(ctx)
    let tokenVerify = JWT.verify(token, global.CONFIG[terminal].SECRET_KEY)
    let key = getTokenKey(ctx, tokenVerify)
    let tokenRedis: any = await clientGet(key)
    let tokenRedisInfo: any = JWT.decode(token)
    // token无效
    if (!tokenRedis || !tokenRedisInfo)
      return { message: '请重新登录', code: global.Code.authLogin, token: token }
    // token与redis保存不一致
    if (tokenRedis !== token)
      return { message: '您的账号已在其他设备登录！', code: global.Code.authFailed, token: token }
    // token的登录设备信息与当前设备信息不一致
    if (!global.CONFIG[terminal].ALLOW_MULTIPLE && tokenRedisInfo.userAgent !== ctx.request.header['user-agent'])
      return { message: '登录设备异常，为了安全请修改密码！', code: global.Code.authFailed, token: token }
  } catch (e) {
    let currentDateValue = global.dayjs().unix()
    // token已过期，但可刷新
    if (tokenInfo && currentDateValue < tokenInfo.delayTime)
      return { message: 'token已过期，请重新刷新', code: global.Code.authRefresh, token: token }
    // token已过期，不可刷新
    return { message: '请重新登录', code: global.Code.authLogin, token: token }
  }
  // token合法有效
  return { message: '验证通过', code: global.Code.success, data: tokenInfo, token: token }
}

/**
 * 静态资源权限校验
*/
async function TokenVerifyStatic(ctx: Koa.Context, file: any) {
  let url = ctx.request.url
  const tokenData: any = await TokenVerify(ctx)
  let isLogin = tokenData.code === 200 && tokenData.data && tokenData.data.id
  if (file.isLogin === 1) {
    if (isLogin) return
    try {
      let vt = getQueryParams(url, 'vt')
      let targetTime = global.dayjs(Number(vt)).valueOf()
      let currentTime = global.dayjs().valueOf()
      if (!(currentTime < targetTime))
        throw new global.ExceptionAuthFailed({ code: 423, message: '链接已过期，无法查看' })
    } catch (error) {
      throw new global.ExceptionAuthFailed({ code: 423, message: '链接已过期，无法查看' })
    }
  }
  let isSecret = tokenData.code === 200 && tokenData.data && tokenData.data.id === file.createUser
  if (file.secret === 1) {
    if (isSecret) return
    try {
      let si = getQueryParams(url, 'si')
      if (si !== file.createUser)
        throw new global.ExceptionAuthFailed({ code: 423, message: '链接受保护，无权限查看' })
    } catch (error) {
      throw new global.ExceptionAuthFailed({ code: 423, message: '链接受保护，无权限查看' })
    }
  }
}

/**
 * user 参数 {id, phone, openid}
 * 生成 token
 * redis 保存 token 结构 { id, phone, openid, delayTime(延迟更新时间), userAgent, terminal }
*/
export async function TokenGernerate(ctx: Koa.Context, user: { [x: string]: any }) {
  let currentTime: number = global.dayjs().unix()
  user.terminal = global.tools.getTerminal(ctx)
  user.delayTime = currentTime + global.CONFIG[user.terminal].EXPIRES_IN + global.CONFIG[user.terminal].DELAY
  user.userAgent = ctx.request.header['user-agent']
  let token = JWT.sign(user, global.CONFIG[user.terminal].SECRET_KEY, {
    expiresIn: global.CONFIG[user.terminal].EXPIRES_IN
  })
  let key = getTokenKey(ctx, user)
  await saveRedisToken(key, token)
  return token
}

/**
 * 获取token保存的key 
*/
export function getTokenKey(ctx: Koa.Context, user: any) {
  let key: any
  key = `${user.id}_${user.openid}_${user.terminal}`
  if (!global.CONFIG[user.terminal].ALLOW_MULTIPLE) key = key + user.userAgent
  return key
}

/**
 * 保存并更新 redis 的 token 记录
*/
async function saveRedisToken(key: string, token: any) {
  await clientDel(key)
  await clientSet(key, token)
}

// 获取请求路径
function getPath(path: string) {
  let index = path.indexOf('?')
  if (index !== -1)
    path = path.substring(0, index)
  return path
}

// 获取静态资源指定参数
function getQueryParams(url: string, key: string) {
  let i = url.indexOf('?')
  if (i === -1) return null
  let queryParams = url.substring(i + 1)
  let queryArr: any = queryParams.split('&')
  queryArr = queryArr.map((val: any) => {
    let index = val.indexOf('=')
    if (index !== -1)
      return {
        key: val.substring(0, index),
        value: val.substring(index + 1)
      }
  })
  let keyValue: any = null
  queryArr.find((item: any) => {
    if (item.key === key) {
      keyValue = decrypt(item.value)
      return true
    }
  })
  return keyValue
}
