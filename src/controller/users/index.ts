/**
 * @description: 用户模块 业务处理
 * @author chen
 * @update 2021-01-27 11:17:43
 * @list 方法集合说明
 *   doUserRegister // 用户注册
 *   doUserLogin // 用户登录
 *   doUserTokenRefresh // 刷新 token 
 *   doUserExit // 用户退出
 *   getUserInfoById // 获取指定用户信息(本用户或指定用户)
 *   doUserEditById // 修改用户部分信息(本用户或指定用户)
 *   doUserEditAvatarSelf // 修改用户头像(仅本用户)
 *   doUserEditPasswordSelf // 修改本用户密码
 *   doUserEditPhoneSelf // 修改本用户手机号
 *   doUserRemoveWechatSelf // 解除小程序绑定
*/

import Koa from 'koa'
import JWT from 'jsonwebtoken'
import { query } from '../../db'
import { TokenGernerate, TokenVerify, getTokenKey } from '../../middlewares/token-auth'
import { decrypt } from '../../utils/crypto'
import { clientDel } from '../../middlewares/redis'
import { getFileById } from '../file-operate'
import { getUuId, getCurrentTime, formatDate } from '../../utils/tools'
import { isExistUser } from './convert'

/**
 * 1 用户注册
*/
export async function doUserRegister(ctx: Koa.Context, next?: any) {
  let password = ctx.data.body.password
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
  let password = decrypt(ctx.data.body.password)
  let sql = `SELECT id, password, openid FROM users_info WHERE phone = ?`
  let phone = ctx.data.body.phone
  const res: any = await query(sql, phone)
  let dbPassword = res[0]['password']
  let newDBPassword = decrypt(dbPassword)
  let flag = password && newDBPassword && password !== 'undefined' && newDBPassword !== 'undefined' && password === newDBPassword
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
  let tokenInfo: any = JWT.decode(tokenData.token)
  if (tokenData.token && tokenInfo && tokenInfo.id) {
    let sql = `SELECT phone, openid FROM users_info WHERE id = ?`
    const res: any = await query(sql, tokenInfo.id)
    if (res.length) {
      let user = {
        id: tokenInfo.id,
        phone: res[0]['phone'],
        openid: res[0]['openid']
      }
      let token = await TokenGernerate(ctx, user)
      throw new global.Success({
        data: token
      })
    }
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
 * 6 8 获取指定用户信息(本用户或指定用户)
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
 * 9 10 修改用户部分信息(本用户或指定用户)
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
 * 11 修改用户头像(仅本用户)
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

/**
 * 12 修改本用户密码
*/
export async function doUserEditPasswordSelf(ctx: Koa.Context, next: any) {
  let id = ctx.user.id
  let password = decrypt(ctx.data.body.password)
  let newPassword = ctx.data.body.newPassword
  if (password === newPassword) {
    throw new global.ExceptionParameter({ message: '新密码不能与旧密码相同' })
  }
  let sql = `SELECT password FROM users_info WHERE id = ?`
  const res: any = await query(sql, id)
  let originPassword = decrypt(res[0]['password'])
  if (password !== originPassword) {
    throw new global.ExceptionParameter({ message: '原始密码不正确' })
  }
  let currentTime = getCurrentTime()
  let sql2 = `UPDATE users_info SET password = ?, update_time = ? WHERE id = ?;`
  let data2 = [newPassword, currentTime, id]
  let res2: any = await query(sql2, data2)
  if (res2.affectedRows) {
    throw new global.Success()
  } else {
    throw new global.ExceptionHttp({
      message: '密码修改失败'
    })
  }
}

/**
 * 13 修改本用户手机号
*/
export async function doUserEditPhoneSelf(ctx: Koa.Context, next: any) {
  let id = ctx.user.id
  let newPhone = ctx.data.body.newPhone
  let password = decrypt(ctx.data.body.password)
  let sql = `SELECT password, phone FROM users_info WHERE id = ?`
  const res: any = await query(sql, id)
  let originPhone = res[0]['phone']
  let originPassword = decrypt(res[0]['password'])
  if (newPhone === originPhone) {
    throw new global.ExceptionParameter({ message: '新手机号不能与旧手机号相同' })
  }
  if (password !== originPassword) {
    throw new global.ExceptionParameter({ message: '原始密码不正确' })
  }
  let flag = await isExistUser(newPhone)
  if (flag) {
    throw new global.ExceptionParameter({ message: '新手机号已存在，请更换要绑定的手机号' })
  }
  let currentTime = getCurrentTime()
  let sql2 = `UPDATE users_info SET phone = ?, update_time = ? WHERE id = ?;`
  let data2 = [newPhone, currentTime, id]
  let res2: any = await query(sql2, data2)
  if (res2.affectedRows) {
    throw new global.Success()
  } else {
    throw new global.ExceptionHttp({
      message: '手机号修改失败'
    })
  }
}

/**
 * 14 解除小程序绑定
*/
export async function doUserRemoveWechatSelf(ctx: Koa.Context, next: any) {
  let id = ctx.user.id
  let password = decrypt(ctx.data.body.password)
  console.log(password);

  let sql = `SELECT password FROM users_info WHERE id = ?`
  const res: any = await query(sql, id)
  let originPassword = decrypt(res[0]['password'])
  if (password !== originPassword) {
    throw new global.ExceptionParameter({ message: '密码不正确' })
  }
  let currentTime = getCurrentTime()
  let sql2 = `UPDATE users_info SET openid = ?, update_time = ? WHERE id = ?;`
  let data2 = [null, currentTime, id]
  let res2: any = await query(sql2, data2)
  if (res2.affectedRows) {
    throw new global.Success()
  } else {
    throw new global.ExceptionHttp({
      message: '解除小程序绑定失败'
    })
  }
}