/**
 * @description: 文件操作 校验相关中间件
 * @author chen
 * @update 2021-02-07 14:38:44
*/

import Koa from 'koa'
import { query } from '../../db'
import { _getUserId } from '../../utils/users'

/**
 * 删除文件时判断是否包含有权限限制操作的文件
*/
export async function doFileDeleteIsPower(ctx: Koa.Context, next: any) {
  const ids: any = ctx.data.query.ids
  const sql = `SELECT file_name as fileName FROM files_info t WHERE t.secret = 1 and FIND_IN_SET(id, ?) and t.create_user != ?`
  const data = [ids, _getUserId(ctx)]
  const res: any = await query(sql, data)
  if (res.length) {
    let illegal = res.map((item: any) => item.fileName).join(',')
    throw new global.ExceptionParameter({
      message: `你没有权限删除“${illegal}”这${res.length}条数据`,
    })
  }
  await next()
}
