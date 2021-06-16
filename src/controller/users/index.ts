/**
 * @description: 用户模块 业务处理
 * @author chen
 * @update 2021-01-27 11:17:43
*/

import Koa from 'koa'
import JWT from 'jsonwebtoken'
import { query } from '../../db'
import { TokenGernerate, TokenVerify, getTokenKey } from '../../middlewares/token-auth'
import { encrypt, decrypt } from '../../utils/crypto'
import { clientDel } from '../../middlewares/redis'
import { getFileById } from '../file-operate'
import { getUuId, getCurrentTime, formatDate } from '../../utils/tools'

/**
 * 1 用户注册
*/
export async function doUserRegister(ctx: Koa.Context, next?: any) {
  let password = encrypt(ctx.data.header['word-info'])
  let phone = ctx.data.body.phone
  let userName = ctx.data.body.userName
  let id = getUuId()
  let currentTime = getCurrentTime()
  let sql = `INSERT users_info (id, user_name, password, phone, update_time, create_time) VALUES (?,?,?,?,?,?)`
  let data = [id, userName, password, phone, currentTime, currentTime]
  const res = await query(sql, data)
  throw new global.Success({
    message: '恭喜，注册成功！'
  })
}

/**
 * 2 用户登录
 * 登录成功时生成 token 并返回
*/
export async function doUserLogin(ctx: Koa.Context, next?: any) {
  let password = encrypt(ctx.data.header['word-info'])
  let sql = `SELECT id, password, openid FROM users_info WHERE phone = ?`
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
      openid: res[0]['openid']
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
 * 4 刷新 token 
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
 * 5 用户退出
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
 * 6 获取指定用户信息(本用户或指定用户)
*/
export async function getUserInfoById(ctx: Koa.Context, next: any, id: any) {
  let sql = `SELECT * FROM users_info WHERE id = ?`
  let res: any = await query(sql, id)
  let userInfo: any
  if (res.length) {
    userInfo = res[0]
    delete userInfo.password
  }
  // 处理头像
  userInfo.head_img = await getFileById(ctx, userInfo.head_img)
  throw new global.Success({
    data: userInfo
  })
}

/**
 * 8 修改用户部分信息(本用户或指定用户)
*/
export async function doUserEditById(ctx: Koa.Context, next: any, id: any) {
  let userName = ctx.data.body.userName
  let sex = ctx.data.body.sex || 0
  let birthday = formatDate(ctx.data.body.birthday)
  let address = ctx.data.body.address
  let professional = ctx.data.body.professional
  let remarks = ctx.data.body.remarks
  let currentTime = getCurrentTime()
  let sql = 'UPDATE users_info SET user_name = ?, sex = ?, birthday = ?, address = ?, professional = ?, remarks = ?, update_time = ? WHERE id = ?;'
  let data = [userName, sex, birthday, address, professional, remarks, currentTime, id]
  let res: any = await query(sql, data)
  if (res.affectedRows) {
    throw new global.Success()
  } else {
    throw new global.ExceptionHttp({
      message: '未找到该用户'
    })
  }
}

/**
 * 9 修改用户头像(仅本用户)
*/
export async function doUserEditAvatarSelf(ctx: Koa.Context, next: any, file: any) {
  let id = ctx.user.id
  let currentTime = getCurrentTime()
  let sql = 'UPDATE users_info SET head_img = ?, update_time = ? WHERE id = ?;'
  let data = [file.id, currentTime, id]
  let res: any = await query(sql, data)
  if (res.affectedRows) {
    throw new global.Success({ data: file })
  } else {
    throw new global.ExceptionHttp({
      message: '未找到该用户'
    })
  }
}
