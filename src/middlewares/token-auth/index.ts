/**
 * @description token权限校验
 * @author chen
 * @update 2021-01-21 14:23:03
*/

import Koa from 'koa'
import BasicAuth from 'basic-auth'
import JWT from 'jsonwebtoken'
import { clientSet, clientGet, clientDel } from '../redis'

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
    let flag = await isEscape(ctx)
    if (!flag) {
      const tokenData: any = await TokenVerify(ctx)
      if (tokenData.code !== global.Code.success)
        throw new global.ExceptionHttp(tokenData)
      ctx.user = tokenData.data
    }
    await next()
  }
}

/**
 * 生成 token
 * redis 保存 token 结构 { id, phone, delayTime(延迟更新时间), userAgent, terminal }
*/
export async function TokenGernerate(ctx: Koa.Context, user: { [x: string]: any }) {
  let currentDate: number = global.dayjs().unix()
  user.delayTime = currentDate + global.CONFIG.EXPIRES_IN + global.CONFIG.DELAY
  user.terminal = global.tools.getTerminal(ctx)
  let token = JWT.sign(user, global.CONFIG.SECRET_KEY, {
    expiresIn: global.CONFIG.EXPIRES_IN
  })
  let key = getTokenKey(ctx, user)
  await saveRedisToken(key, token)
  return token
}

/**
 * 校验 token 合法性 普通接口请求拦截
*/
export async function TokenVerify(ctx: Koa.Context) {
  const tokenOrigin = BasicAuth(ctx.req)
  if (!tokenOrigin || !tokenOrigin.name)
    return { message: 'token不存在', code: global.Code.forbidden }
  const token = tokenOrigin.name
  const tokenInfo: any = JWT.decode(token)
  try {
    let tokenVerify = JWT.verify(token, global.CONFIG.SECRET_KEY)
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
    if (tokenRedisInfo.userAgent !== ctx.request.header['user-agent'])
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
 * 是否不校验
*/
async function isEscape(ctx: Koa.Context) {
  let path = ctx.request.url
  let flag: boolean = false
  let index = path.indexOf('?')
  if (index !== -1)
    path = path.substring(0, index)
  // 如果是请求静态资源
  if (path.startsWith('/files/') || path.startsWith('/images/')) {
    const { query } = require('../../db')
    let lastIndex = path.lastIndexOf('/')
    let filePath = path.substring(lastIndex + 1)
    let sql = 'SELECT is_login as isLogin, secret, create_user as createUser FROM files_info WHERE file_path = ?'
    const res = await query(sql, filePath)
    if (res.length) {
      if (res[0]['isLogin'] == 0 || !global.CONFIG.VERIFY_CHECK_FILE) flag = true
      if (res[0]['secret'] == 1) {
        const tokenData: any = await TokenVerify(ctx)
        if (tokenData.code !== global.Code.success)
          throw new global.ExceptionHttp(tokenData)
        if (res[0]['createUser'] !== tokenData.data.id)
          throw new global.ExceptionForbidden({ message: '你没有权限访问该文件' })
        flag = true
      }
    } else
      throw new global.ExceptionNotFound()
  } else { // 普通路由
    unlessPath.find(value => {
      if (path === value) {
        flag = true
        return true
      }
    })
  }
  return flag
}

/**
 * 获取token保存的key 
*/
export function getTokenKey(ctx: Koa.Context, user: any) {
  let key: any
  key = user.id + '_' + user.terminal
  if (global.CONFIG.ALLOW_MULTIPLE) key = key + user.userAgent
  return key
}

/**
 * 保存并更新 redis 的 token 记录
*/
async function saveRedisToken(key: string, token: any) {
  await clientDel(key)
  await clientSet(key, token)
}
