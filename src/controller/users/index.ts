/**
 * @description: 用户模块 业务处理
 * @author chen
 * @update 2021-01-27 11:17:43
*/

import Koa from 'koa'
import { query, execTrans } from '../../db'
import { TokenGernerate, TokenVerify, getTokenKey } from '../../middlewares/token-auth'
import { encrypt, decrypt } from '../../utils/crypto'
import { clientGet, clientDel } from '../../middlewares/redis'

/**
 * 用户注册
*/
export async function doUserRegister(ctx: Koa.Context, next?: any) {
  let password = encrypt(ctx.data.header['word-info'])
  let phone = ctx.data.body.phone
  let sql = `INSERT tb_admin (name, password, sex, phone,instroduce, root) VALUES (?,?,?,?,?,?)`
  let data = ['测试张三', password, '男', phone, '测试人员', '1']
  const res = await query(sql, data)
  throw new global.Success({
    message: '恭喜，注册成功！'
  })
}

/**
 * 用户登录
 * 登录成功时生成 token 并返回
*/
export async function doUserLogin(ctx: Koa.Context, next?: any) {
  let password = encrypt(ctx.data.header['word-info'])
  let sql = `SELECT id, password FROM tb_admin WHERE phone = ?`
  let phone = ctx.data.body.phone
  const res: any = await query(sql, phone)
  let dbPassword = res[0]['password']
  let newPassword = await decrypt(password)
  let newDBPassword = decrypt(dbPassword)
  let flag = newPassword && newDBPassword && newPassword !== 'undefined' && newDBPassword !== 'undefined' && newPassword === newDBPassword
  if (flag) {
    // 生成 token 
    let user = {
      id: res[0]['id'],
      phone,
      userAgent: ctx.request.header['user-agent']
    }
    let token = await TokenGernerate(ctx, user)
    throw new global.Success({
      data: token
    })
  }
  throw new global.ExceptionParameter({
    message: '密码错误'
  })
}

/**
 * 刷新 token 
*/
export async function doUserTokenRefresh(ctx: Koa.Context, next?: any) {
  const tokenData: any = await TokenVerify(ctx)
  if (tokenData.code === global.Code.success)
    throw new global.Success({
      data: tokenData.token
    })
  let tokenInfo: any = await clientGet(tokenData.token)
  if (!tokenData.token || !tokenInfo)
    throw new global.ExceptionHttp({
      message: '请重新登录',
      code: global.Code.authRegister,
    })
  let user = {
    id: tokenInfo.id,
    phone: tokenInfo.phone,
    userAgent: ctx.request.header['user-agent']
  }
  let token = await TokenGernerate(ctx, user)
  throw new global.Success({
    data: token
  })
}

/**
 * 用户退出
*/
export async function doUserExit(ctx: Koa.Context, next?: any) {
  let key = getTokenKey(ctx, ctx.user)
  let tokenKey:any = await clientGet(key)
  await clientDel(key)
  await clientDel(tokenKey)
  throw new global.Success({
    data: '已退出'
  })
}


/**
 * 获取用户信息
*/

export async function getUserInfo(ctx: Koa.Context, next?: any) {
  let sql = `SELECT * FROM tb_admin WHERE id = ?`
  let res: any = await query(sql, ctx.user.id)
  res = res[0]
  delete res.password
  throw new global.Success({
    data: res
  })
}
