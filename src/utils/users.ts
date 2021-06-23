/**
 * @description: 用户相关操作方法
 * @author chen
 * @update 2021-06-22 10:40:05
 * @list 方法集合说明
 *   getTerminal // 获取请求终端
 *   getUserId // 获取用户id 
*/

import Koa from 'koa'
import { query } from '../db'
import { toCamelCase } from './tools'

/**
 * 获取请求终端
*/
export function getTerminal(ctx: Koa.Context) {
  if (ctx.request.header['word-terminal']) return ctx.request.header['word-terminal'].toLocaleUpperCase()
  let method = ctx.request.url
  return method.substring(1, method.indexOf('/', 1)).toLocaleUpperCase()
}

/**
 * 获取用户id，小程序使用openid 其他平台使用用户id
*/
export function getUserId(ctx: Koa.Context) {
  let terminal = getTerminal(ctx)
  if (terminal === 'WECHAT') return ctx.user.openid
  return ctx.user.id
}

/**
 * 获取用户信息，仅用于后端业务用户信息需求处理，不能直接返回给前端
 * 小程序端 返回小程序所有信息和关联的用户信息（如果有关联）
 * 其他端 返回用户表所有信息和关联的小程序信息（如果有关联）
*/
export async function getUserInfo(ctx: Koa.Context) {
  if (ctx.userInfo && (ctx.userInfo.id || ctx.userInfo.openid))
    return ctx.userInfo
  let terminal = getTerminal(ctx)
  let sql = ''
  let data: any[] = []
  if (terminal === 'WECHAT') {
    sql = `SELECT t1.openid, t1.session_key, t1.avatar_url, t1.nick_name, t1.country, t1.province, t1.city, t1.language, t2.id, t2.user_name, t2.password, t2.phone, t2.sex, t2.birthday, t2.create_time, t2.address, t2.professional, t2.head_img, t2.is_admin, t2.remarks FROM users_wechat_info t1 LEFT JOIN users_info t2 ON t1.openid = t2.openid WHERE t1.openid = ?`
    data = [ctx.user.openid]
  } else {
    sql = `SELECT t1.openid, t1.session_key, t1.avatar_url, t1.nick_name, t1.country, t1.province, t1.city, t1.language, t1.create_time, t2.id, t2.user_name, t2.password, t2.phone, t2.sex, t2.birthday, t2.address, t2.professional, t2.head_img, t2.is_admin, t2.remarks FROM users_info t2 LEFT JOIN users_wechat_info t1 ON t1.openid = t2.openid WHERE t2.id = ?`
    data = [ctx.user.id]
  }
  const res: any = await query(sql, data)
  if (res && res.length) {
    ctx.userInfo = toCamelCase(res[0])
    return ctx.userInfo
  } else
    throw new global.ExceptionForbidden({ message: '用户不存在' })
}
