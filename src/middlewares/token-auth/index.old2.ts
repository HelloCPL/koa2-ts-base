/**
 * @description token权限校验
 * @author chen
 * @update 2021-01-21 14:23:03
*/

import Koa from 'koa'
import BasicAuth from 'basic-auth'
import JWT from 'jsonwebtoken'

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
      let decode
      if (!token || !token.name)
        throw new global.ExceptionForbidden({ message: 'token不合法' })
      try {
        decode = JWT.verify(token.name, security.SECRET_KEY)
      } catch (e) {
        throw new global.ExceptionAuthFailed({ message: 'token已过期' })
      }
      ctx.user = decode
      await next()
    }
  }
}

/**
 * 生成 token
*/
export function TokenGernerate(user: { [x: string]: any }, terminal: string) {
  const security = getSecurity(terminal)
  return JWT.sign(user, security.SECRET_KEY, {
    expiresIn: security.EXPIRES_IN
  })
}

/**
 * 校验 token 合法性
*/
export function TokenVerify(ctx: Koa.Context) {
  const token = BasicAuth(ctx.req)
  const security = getSecurity(global.tools.getTerminal(ctx))
  if (!token || !token.name) return { message: 'token不合法', code: global.Code.forbidden }
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
