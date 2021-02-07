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
    console.log('访问的接口是：' + ctx.request.url);
    console.log('');
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
 * redis 保存 token 结构 { id, phone, delayTime, userAgent }
*/
export async function TokenGernerate(ctx: Koa.Context, user: { [x: string]: any }) {
  let currentDate: number = global.dayjs().unix()
  user.delayTime = currentDate + global.CONFIG.EXPIRES_IN + global.CONFIG.DELAY
  let token = JWT.sign(user, global.CONFIG.SECRET_KEY, {
    expiresIn: global.CONFIG.EXPIRES_IN
  })
  let key = getTokenKey(ctx, user)
  await saveRedisToken(key, token, user)
  return token
}

/**
 * 校验 token 合法性
*/
export async function TokenVerify(ctx: Koa.Context) {
  const token = BasicAuth(ctx.req)
  if (!token || !token.name)
    return { message: 'token不存在', code: global.Code.forbidden }
  let tokenData
  try {
    tokenData = JWT.verify(token.name, global.CONFIG.SECRET_KEY)
    let key = getTokenKey(ctx, tokenData)
    let tokenRedis: any = await clientGet(key)
    let tokenRedisInfo: any = await clientGet(tokenRedis)
    // token无效
    if (!tokenRedis || !tokenRedisInfo)
      return { message: '请重新登录', code: global.Code.authRegister, token: token.name }
    // token与redis保存不一致
    if (tokenRedis !== token.name)
      return { message: '您的账号已在其他设备登录！', code: global.Code.authFailed, token: token.name }
    // token的登录设备信息与当前设备信息不一致
    if (tokenRedisInfo.userAgent !== ctx.request.header['user-agent'])
      return { message: '登录设备异常，为了安全请修改密码！', code: global.Code.authFailed, token: token.name }
  } catch (e) {
    let tokenInfo: any = await clientGet(token.name)
    let currentDateValue = global.dayjs().unix()
    // token已过期，但可刷新
    if (tokenInfo && currentDateValue < tokenInfo.delayTime)
      return { message: 'token已过期，请重新刷新', code: global.Code.authRefresh, token: token.name }
    // token已过期，不可刷新
    return { message: '请重新登录', code: global.Code.authRegister, token: token.name }
  }
  // token合法有效
  return { message: '验证通过', code: global.Code.success, data: tokenData, token: token.name }
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
      if (res[0]['isLogin'] == 0) flag = true
      if (res[0]['secret'] == 1) {
        try {
          const token = BasicAuth(ctx.req) || { name: ctx.request.query.token }
          let tokenData: any = JWT.verify(token.name, global.CONFIG.SECRET_KEY)
          if (res[0]['createUser'] !== tokenData.id)
            throw new global.ExceptionForbidden({ message: '你没有权限访问该文件' })
        } catch (e) {
          throw new global.ExceptionForbidden({ message: '你没有权限访问该文件' })
        }
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
  let terminal = global.tools.getTerminal(ctx)
  key = user.id + '_' + terminal
  if (global.CONFIG.ALLOW_MULTIPLE) key = key + user.userAgent
  return key
}

/**
 * 保存并更新 redis 的 token 记录
*/
async function saveRedisToken(key: string, token: any, user: any) {
  let tokenKey: any = await clientGet(key)
  await clientDel(key)
  await clientDel(tokenKey)
  await clientSet(key, token)
  await clientSet(token, user)
}
