/**
 * @description token权限校验
 * @author chen
 * @update 2021-01-21 14:23:03
*/

import Koa from 'koa'
import BasicAuth from 'basic-auth'
import JWT from 'jsonwebtoken'
import redisClient from '../redis'

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
    if (isEscape(ctx.request.url)) {
      await next()
    } else {
      const token = BasicAuth(ctx.req)
      const security = getSecurity(global.tools.getTerminal(ctx))
      let tokenData: any
      if (!token || !token.name)
        throw new global.ExceptionForbidden({ message: 'token不存在' })
      try {
        tokenData = JWT.verify(token.name, security.SECRET_KEY)
        // token与redis保存的token不一致
        // token 携带的设备号与当前设备号不一致 


        // let key = global.tools.getTerminal + '_' + decode.id
        // let originToken = await redisClient.get(key)
        // if (token.name !== originToken)
        //   throw new global.ExceptionForbidden({ message: 'token不合法' })
        ctx.user = tokenData
      } catch (e) {
        // 刷新时间未过期
        // 刷新时间已过期
        throw new global.ExceptionAuthFailed({ message: 'token已过期' })
      }
      await next()
    }
  }
}

/**
 * 生成 token
 * token 过期自动清除 或退出登录后拦截旧 token
 * redis 保存 token 结构 { id, phone, delayTime, userAgent }
*/
export function TokenGernerate(ctx: Koa.Context, user: { [x: string]: any }) {
  let terminal = global.tools.getTerminal(ctx)
  const security = getSecurity(terminal)
  let currentDate: number = global.dayjs().unix()
  user.delayTime = currentDate + security.EXPIRES_IN - + security.DELAY
  let token = JWT.sign(user, security.SECRET_KEY, {
    expiresIn: security.EXPIRES_IN
  })
  let key = user.id + '_' + terminal
  if (global.CONFIG.ALLOW_MULTIPLE) key = key + user.userAgent
  // saveRedisToken(key, token, user)
  return token
}

/**
 * 校验 token 合法性
*/
export function TokenVerify(ctx: Koa.Context) {
  const token = BasicAuth(ctx.req)
  const security = getSecurity(global.tools.getTerminal(ctx))
  if (!token || !token.name) return { message: 'token不存在', code: global.Code.forbidden }
  try {
    JWT.verify(token.name, security.SECRET_KEY)
  } catch (e) {
    return { message: 'token已过期', code: global.Code.authFailed }
  }
  return { message: 'token有效', code: global.Code.success }
}

/**
 * 是否不校验
*/
function isEscape(path: string) {
  let i = path.indexOf('?')
  if (i !== -1) {
    path = path.substring(0, i)
  }
  let flag: boolean = false
  unlessPath.find(value => {
    if (path === value) {
      flag = true
      return true
    }
  })
  return flag
}

/**
 * 获取 SECURITY
*/
function getSecurity(terminal: string) {
  return global.CONFIG['SECURITY_' + terminal]
}

/**
 * 保存 redis 的 token 记录
*/
async function saveRedisToken(key: string, token: any, user: any) {
  await clearRedisToken(key)
  await redisClient.set(key, token)
  await redisClient.set(token, JSON.stringify(user))
}

/**
 * 删除 redis 的 token 记录
*/
async function clearRedisToken(key: string) {
  let originToken: any = await redisClient.get(key)
  await redisClient.del(key)
  await redisClient.del(originToken)
}
