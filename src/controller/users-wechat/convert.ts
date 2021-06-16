/**
 * @description: 小程序用户拦截
 * @author chen
 * @update 2021-06-16 14:35:01
*/

import Koa from 'koa'
import { query } from '../../db'

/**
 * 登录判断微信openID是否存在
*/
export async function isExistUserOpenid(openid: any) {
  let sql = `SELECT openid FROM users_wechat_info WHERE openid = ?`
  const res: any = await query(sql, openid)
  if (res && res.length) return true
  return false
}

/**
 * 登录判断是否绑定微信openID
*/
export async function isBindingUserOpenid(openid: any) {
  let sql = `SELECT id, phone FROM users_info WHERE openid = ?`
  const res: any = await query(sql, openid)
  if (res && res.length) return res[0]
  return {
    id: null,
    phone: null
  }
}

