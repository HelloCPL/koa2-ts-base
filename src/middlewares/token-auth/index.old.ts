/**
 * @description token权限校验
 * @author chen
 * @update 2021-01-21 14:23:03
*/

import Koa from 'koa'
import BasicAuth from 'basic-auth'
import JWT from 'jsonwebtoken'
import { ExceptionForbidden, ExceptionAuthFailed } from '../../utils/http-exception'

// 权限校验类
class Auth {
  static unlessPath: string[] // 不校验路由集合

  constructor(unlessPath: string[]) {
    Auth.unlessPath = unlessPath
  }

  // 权限拦截
  get m() {
    return async (ctx: Koa.Context, next: any) => {
      console.log('访问的接口是：' + ctx.request.url);
      if (Auth.isEscape(ctx.request.url)) {
        await next()
      } {
        const token = BasicAuth(ctx.req)
        console.log('token:');
        console.log(token);
        const security = Auth.getSecurity(global.tools.getTerminal(ctx))
        let decode
        if (!token || !token.name)
          throw new ExceptionForbidden({ message: 'token不合法' })
        try {
          decode = JWT.verify(token.name, security.SECRET_KEY)
        } catch (e) {
          throw new ExceptionAuthFailed({ message: 'token已过期' })
        }
        ctx.user = decode
        await next()
      }
    }
  }

  // 生成token
  static tokenGernerate(user: { [x: string]: any }, terminal: string) {
    const security = Auth.getSecurity(terminal)
    return JWT.sign({
      id: user.id
    }, security.SECRET_KEY, {
      expiresIn: security.EXPIRES_IN
    })
  }

  // 校验 token 合法性
  tokenVerify(ctx: Koa.Context) {
    const token = BasicAuth(ctx.req)
    const security = Auth.getSecurity(global.tools.getTerminal(ctx))
    if (!token || !token.name) return { message: 'token不合法', code: global.Code.forbidden }
    try {
      JWT.verify(token.name, security.SECRET_KEY)
    } catch (e) {
      return { message: 'token已过期', code: global.Code.authFailed }
    }
    return { message: 'token有效', code: global.Code.success }
  }

  // 是否不校验
  static isEscape(path: string) {
    let i = path.indexOf('?')
    if (i !== -1) {
      path = path.substring(0, i)
    }
    let flag: boolean = false
    Auth.unlessPath.find(value => {
      if (path === value) {
        flag = true
        return true
      }
    })
    return flag
  }

  // SECURITY
  static getSecurity(terminal: string) {
    return global.CONFIG['SECURITY_' + terminal]
  }

}

export default Auth













