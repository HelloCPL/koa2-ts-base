/**
 * @description: 用户模块小程序端 业务处理
 * @author chen
 * @update 2021-06-16 14:30:19
*/

import Koa from 'koa'
import { codeToOpenId } from '../../lib/wechat-openid'
import { isExistUserOpenid, isBindingUserOpenid } from './convert'
import { getCurrentTime } from '../../utils/tools'
import { query } from '../../db'
import { TokenGernerate } from '../../middlewares/token-auth'
import { getFileById } from '../file-operate'
import { encrypt, decrypt } from '../../utils/crypto'

/**
 * 3 用户登录（小程序用户登录）
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
    let currentTime = getCurrentTime()
    let sql = `INSERT users_wechat_info (openid, session_key, avatar_url, nick_name, country, province, city, language, create_time) VALUES (?,?,?,?,?,?,?,?,?)`
    let data = [wechatData.openid, wechatData.session_key, avatarUrl, nickName, country, province, city, language, currentTime]
    await query(sql, data)
  }
  const res = await isBindingUserOpenid(wechatData.openid)
  // 返回 token 
  let user = {
    id: res.id,
    phone: res.phone,
    openid: wechatData.openid
  }
  let token = await TokenGernerate(ctx, user)
  throw new global.Success({
    data: token
  })
}


/**
 * 7 获取本用户信息(小程序用户，只能获取本用户信息，无法获取指定用户信息)
*/
export async function getUserInfoSelfWeChat(ctx: Koa.Context, next?: any) {
  // let sql = `SELECT *, t1.openid, t1.create_time FROM users_wechat_info t1 LEFT JOIN users_info t2 ON t1.openid = t2.openid WHERE t1.openid = ?`
  let openid = ctx.user.openid
  console.log(ctx.user);
  if (!openid) throw new global.ExceptionNotFound({ message: '用户不存在' })
  let sql = `SELECT * FROM users_wechat_info WHERE openid = ?`
  let res: any = await query(sql, openid)
  res = res[0]
  // delete res.password
  delete res['session_key']
  // 处理头像
  // res.head_img = await getFileById(ctx, res.head_img)
  throw new global.Success({
    data: res
  })
}

/**
 * 10 关联用户账号(仅小程序用户)
*/
export async function doUserInfoAssociateWeChat(ctx: Koa.Context, next: any) {
  let sql = `SELECT id, password FROM users_info WHERE phone = ?`
  let phone = ctx.data.body.phone
  const res: any = await query(sql, phone)
  let dbPassword = await decrypt(res[0]['password'])
  let password = await decrypt(ctx.data.body.password)
  if (password && dbPassword && password === dbPassword) {
    let id = res[0]['id']
    let openid = ctx.user.openid
    let currentTime = getCurrentTime()
    let sql2 = 'UPDATE users_info SET openid = ?, update_time = ? WHERE id = ?;'
    let data2 = [openid, currentTime, id]
    const res2: any = await query(sql2, data2)
    if (res2.affectedRows) {
      // 返回新的token
      let user = { id, phone, openid }
      let token = await TokenGernerate(ctx, user)
      throw new global.Success({
        data: token
      })
    } else {
      throw new global.ExceptionHttp({
        message: '账号关联失败'
      })
    }
  }
  throw new global.ExceptionParameter({
    message: '密码错误'
  })
}
