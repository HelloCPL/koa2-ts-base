/**
 * @description: 用户模块 校验相关中间件 
 * @author chen
 * @update 2021-01-27 17:13:33
*/

import Koa from 'koa'
import { query } from '../../db'

/**
 * 注册判断用户是否已存在
*/
export async function doUserRegisterIsExist(ctx: Koa.Context, next: any) {
  let flag = await isExistUser(ctx.data.body.phone)
  if (flag)
    throw new global.ExceptionParameter({
      message: '该用户已存在'
    })
  await next()
}

/**
 * 登录判断用户是否不存在
*/
export async function doUserLoginIsNotExist(ctx: Koa.Context, next: any) {
  let flag = await isExistUser(ctx.data.body.phone)
  if (!flag)
    throw new global.ExceptionParameter({
      message: '该用户不存在'
    })
  await next()
}

/**
 * 判断用户是否存在
*/
async function isExistUser(phone: any) {
  let sql = `SELECT id FROM users_info WHERE phone = ?`
  const res: any = await query(sql, phone)
  if (res && res.length) return true
  return false
}
