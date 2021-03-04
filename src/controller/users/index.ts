/**
 * @description: 用户模块 业务处理
 * @author chen
 * @update 2021-01-27 11:17:43
*/

import Koa from 'koa'
import JWT from 'jsonwebtoken'
import { query, execTrans } from '../../db'
import { TokenGernerate, TokenVerify, getTokenKey } from '../../middlewares/token-auth'
import { encrypt, decrypt } from '../../utils/crypto'
import { clientGet, clientDel } from '../../middlewares/redis'
import { codeToOpenId } from '../../lib/wechat-openid'
import { isExistUserOpenid, isBindingUserOpenid } from './convert'

/**
 * 用户注册
*/
export async function doUserRegister(ctx: Koa.Context, next?: any) {
  let password = encrypt(ctx.data.header['word-info'])
  let phone = ctx.data.body.phone
  let id = global.tools.getUuId()
  let sql = `INSERT users_info (id, user_name, password, phone) VALUES (?,?,?,?)`
  let data = [id, '测试张三', password, phone]
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
  let sql = `SELECT id, password FROM users_info WHERE phone = ?`
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
      openid: null
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
 * 用户登录（小程序用户登录）
 * 获取 openID ，如果 openID 存在直接返回token，否则注册后返回token
*/
export async function doUserLoginWeChat(ctx: Koa.Context, next?: any) {
  let code = ctx.data.body.code
  let wechatData = await codeToOpenId(code)
  let flag = await isExistUserOpenid(wechatData.openid)
  if (!flag) { // 注册
    let avatarUrl = ctx.data.body.avatarUrl
    let nickName = ctx.data.body.nickName
    let country = ctx.data.body.country
    let province = ctx.data.body.province
    let city = ctx.data.body.city
    let language = ctx.data.body.language
    let sql = `INSERT users_wechat_info (openid, session_key, avatar_url, nick_name, country, province, city, language) VALUES (?,?,?,?,?,?,?,?)`
    let data = [wechatData.openid, wechatData.session_key, avatarUrl, nickName, country, province, city, language]
    await query(sql, data)
  }
  const res = await isBindingUserOpenid(wechatData.openid)
  // 返回 token 
  let user = {
    id: res.id,
    phone: res.phone,
    openid: wechatData.openid
  }
  console.log(user);
  let token = await TokenGernerate(ctx, user)
  throw new global.Success({
    data: token
  })
}

/**
 * 刷新 token 
 * 如果 token 还在有效时间内直接返回，否则生成新的token
*/
export async function doUserTokenRefresh(ctx: Koa.Context, next?: any) {
  const tokenData: any = await TokenVerify(ctx)
  if (tokenData.code === global.Code.success)
    throw new global.Success({
      data: tokenData.token
    })
  let tokenInfo: any = JWT.decode(tokenData.token)
  if (tokenData.token && tokenData.code === global.Code.authRefresh && tokenInfo) {
    let user = {
      id: tokenInfo.id,
      phone: tokenInfo.phone,
      openid: tokenInfo.openid
    }
    let token = await TokenGernerate(ctx, user)
    throw new global.Success({
      data: token
    })
  }
  throw new global.ExceptionHttp({
    message: '请重新登录',
    code: global.Code.authLogin,
  })
}

/**
 * 用户退出
 * 清除 redis 的 token
*/
export async function doUserExit(ctx: Koa.Context, next?: any) {
  let key = getTokenKey(ctx, ctx.user)
  await clientDel(key)
  throw new global.Success({
    data: '已退出'
  })
}

/**
 * 获取本用户信息
*/
export async function getUserInfoSelf(ctx: Koa.Context, next?: any) {
  let sql = `SELECT * FROM users_info WHERE id = ?`
  let res: any = await query(sql, ctx.user.id)
  res = res[0]
  delete res.password
  throw new global.Success({
    data: res
  })
}

/**
 * 获取本用户信息(小程序用户)
*/
export async function getUserInfoSelfWeChat(ctx: Koa.Context, next?: any) {
  let sql = `SELECT *, t1.openid FROM users_wechat_info t1 LEFT JOIN users_info t2 ON t1.openid = t2.openid WHERE t1.openid = ?`
  let res: any = await query(sql, ctx.user.openid)
  res = res[0]
  delete res.password
  delete res['session_key']
  throw new global.Success({
    data: res
  })
}

/**
 * 获取指定用户信息
*/
export async function getUserInfoById(ctx: Koa.Context, next?: any) {
  let sql = `SELECT * FROM users_info WHERE id = ?`
  let id = ctx.data.query.id
  let res: any = await query(sql, id)
  let userInfo: any
  if (res.length) {
    userInfo = res[0]
    delete userInfo.password
  }
  throw new global.Success({
    data: userInfo
  })
}
