/**
 * @description: 博客相关操作
 * @author chen
 * @update 2021-03-10 14:55:00
*/


import Koa from 'koa'
import { query, execTrans } from '../../db'
import { getUuId, getCurrentTime } from '../../utils/tools'
import { getTerminalCode, _getUserId } from '../../utils/users'
import { updateSet, selectWhere, selectWhereKeyword } from '../../utils/handle-mysql'
import { _getUserInfo } from '../../utils/users'
import { handleArticleField } from './convert'
import { doBlogCommentDeleteByArticle } from '../blog-interact/convert'
/**
 * 1 新增博客文章
*/
export async function doBlogAdd(ctx: Koa.Context, next?: any) {
  let body: any = ctx.data.body
  let source = getTerminalCode(ctx)
  let isLogin = body.isLogin || '0'
  let isSecret = body.isSecret || '0'
  let isDraft = body.isDraft || '0'
  let isTop = body.isTop || '0'
  let isHot = body.isHot || '0'
  let currentTime = getCurrentTime()
  let sql = `INSERT blog_article (id, title, content, cover_img, classify, tag, type, attachment, create_user, is_login, is_secret, is_draft, is_top, is_hot, source, create_time, update_time, remarks) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?, ?)`
  let data = [getUuId(), body.title, body.content, body.coverImg, body.classify, body.tag, body.type, body.attachment, _getUserId(ctx), isLogin, isSecret, isDraft, isTop, isHot, source, currentTime, currentTime, body.remarks]
  const res: any = await query(sql, data)
  if (res && res['affectedRows'])
    throw new global.Success()
  else throw new global.ExceptionHttp({ message: '新增失败' })
}

/**
 * 2 编辑博客文章
*/
export async function doBlogEdit(ctx: Koa.Context, next?: any) {
  let body: any = ctx.data.body
  // 可设置项
  let updateTime = getCurrentTime()
  body.updateTime = updateTime
  let sqlParams = updateSet({
    valid: ['title', 'content', 'cover_img', 'classify', 'tag', 'type', 'attachment', 'is_login', 'is_secret', 'is_draft', 'is_top', 'is_hot', 'remarks', 'update_time'],
    data: body,
  })
  // 可设置权限
  const userInfo: any = await _getUserInfo(ctx)
  let sqlPower = { sql: '', data: [] }
  if (userInfo.isAdmin != '1') {
    sqlPower.sql = 'AND (create_user = ? OR create_user = ?)'
    // @ts-ignore
    sqlPower.data = [userInfo.id, userInfo.openid]
  }
  let sql = `UPDATE blog_article SET ${sqlParams.sql} WHERE id = ? ${sqlPower.sql}`
  let data = [...sqlParams.data, body.id, ...sqlPower.data]
  const res: any = await query(sql, data)
  throw new global.Success()
}

/**
 * 3 删除博客文章，多个用逗号隔开（作者或管理员可删）
*/
export async function doBlogDeletes(ctx: Koa.Context, next?: any) {
  let ids = ctx.data.query.ids
  let sql = `DELETE FROM blog_article WHERE FIND_IN_SET(id, ?)`
  const res: any = await query(sql, ids)
  // await doBlogCommentDeleteByArticle(ids)
  throw new global.Success()
}

/**
 * 4 获取指定博客文章（isSecret=1 隐私文章仅作者或管理员可查看）
*/
export async function doBlogInfo(ctx: Koa.Context, next?: any) {
  let sql = `SELECT * FROM blog_article WHERE id = ?`
  let res: any = await query(sql, ctx.data.query.id)
  res = await handleArticleField(ctx, res) // 添加字段
  throw new global.Success({ data: res[0] })
}

/**
 * 5 获取个人博客文章列表
*/
export async function doBlogListSelf(ctx: Koa.Context, next?: any) {
  let queryData: any = ctx.data.query
  // where 条件
  let sqlParams = selectWhere({
    valid: ['type', 'is_secret', 'is_draft', 'is_top', 'is_hot'],
    data: queryData,
  })
  // keyword 模糊搜索
  let keywordParams = selectWhereKeyword({
    valid: ['title', 'content'],
    keyword: queryData.keyword
  })
  // 分页
  queryData.pageNo = queryData.pageNo * 1 || 1
  queryData.pageSize = queryData.pageSize * 1 || 10
  let pageNo = (queryData.pageNo - 1) * queryData.pageSize
  const userInfo: any = await _getUserInfo(ctx)
  const whereSql = `WHERE (create_user = ? OR create_user = ?) ${sqlParams.sql ? 'AND ' + sqlParams.sql : ''} ${keywordParams.sql ? 'AND ' + keywordParams.sql : ''}`
  let sql1 = `SELECT COUNT(id) as total FROM blog_article ${whereSql}`
  let data1 = [userInfo.id, userInfo.openid, ...sqlParams.data, ...keywordParams.data]
  let sql2 = `SELECT * FROM blog_article ${whereSql} ORDER BY update_time DESC, create_time DESC LIMIT ?, ?`
  let data2 = [...data1, pageNo, queryData.pageSize]
  let queryParams = [
    { sql: sql1, data: data1 },
    { sql: sql2, data: data2 }
  ]
  const res: any = await execTrans(queryParams)
  let total = res[0][0]['total']
  let dataList = await handleArticleField(ctx, res[1]) // 添加字段
  throw new global.Success({ data: dataList, total })
}
