/**
 * @description: 点赞 收藏 评论等用户交互
 * @author chen
 * @update 2021-06-22 15:09:01
*/

import Koa from 'koa'
import { query, execTrans } from '../../db'
import { getUuId, getCurrentTime } from '../../utils/tools'
import { getTerminalCode, _getUserId, _getUserInfo } from '../../utils/users'
import { judgeIsLike, judgeIsCollection, findCommentIsExist, handleCommentField } from './convert'
import { validateRange } from '../../utils/validator'

/**
 * 1 点赞
*/
export async function doBlogLike(ctx: Koa.Context, next?: any) {
  const isLike = await judgeIsLike(ctx, ctx.data.query.id)
  if (!isLike) {
    let queryData: any = ctx.data.query
    validateRange(queryData.type, [1], 'type 参数有误')
    let type = queryData.type || '1'
    let createTime = getCurrentTime()
    let sql = `INSERT blog_like (id, article_id, type, create_user, create_time) VALUES (?,?,?,?,?)`
    let data = [getUuId(), queryData.id, type, _getUserId(ctx), createTime]
    await query(sql, data)
  }
  throw new global.Success()
}

/**
 * 2 取消点赞
*/
export async function doBlogLikeCancel(ctx: Koa.Context, next?: any) {
  const isLike = await judgeIsLike(ctx, ctx.data.query.id)
  if (isLike) {
    const userInfo: any = await _getUserInfo(ctx)
    let sql = `DELETE FROM blog_like WHERE article_id = ? and (create_user = ? OR create_user = ?)`
    let data = [ctx.data.query.id, userInfo.id, userInfo.openid]
    await query(sql, data)
  }
  throw new global.Success()
}

/**
 * 3 收藏
*/
export async function doBlogCollection(ctx: Koa.Context, next?: any) {
  const isCollection = await judgeIsCollection(ctx, ctx.data.query.id)
  if (!isCollection) {
    let queryData: any = ctx.data.query
    validateRange(queryData.type, [1], 'type 参数有误')
    let type = queryData.type || '1'
    let createTime = getCurrentTime()
    let sql = `INSERT blog_collection (id, article_id, type, create_user, create_time) VALUES (?,?,?,?,?)`
    let data = [getUuId(), queryData.id, type, _getUserId(ctx), createTime]
    await query(sql, data)
  }
  throw new global.Success()
}

/**
 * 4 取消收藏
*/
export async function doBlogCollectionCancel(ctx: Koa.Context, next?: any) {
  const isCollection = await judgeIsCollection(ctx, ctx.data.query.id)
  if (isCollection) {
    const userInfo: any = await _getUserInfo(ctx)
    let sql = `DELETE FROM blog_collection WHERE article_id = ? and (create_user = ? OR create_user = ?)`
    let data = [ctx.data.query.id, userInfo.id, userInfo.openid]
    await query(sql, data)
  }
  throw new global.Success()
}

/**
 * 5 评论 type 1 第一级别评论
*/
export async function doBlogCommentAddType1(ctx: Koa.Context, next?: any) {
  let body = ctx.data.body
  let source = getTerminalCode(ctx)
  let sql = `INSERT blog_comment (id, article_id, content, from_uid, source, create_time) VALUES (?,?,?,?,?,?)`
  let data = [getUuId(), body.id, body.content, _getUserId(ctx), source, getCurrentTime()]
  const res: any = await query(sql, data)
  if (res && res['affectedRows'])
    throw new global.Success()
  else throw new global.ExceptionHttp({ message: '评论失败' })
}

/**
 * 5 评论 type 2 第二级别评论
*/
export async function doBlogCommentAddType2(ctx: Koa.Context, next?: any) {
  let body = ctx.data.body
  let source = getTerminalCode(ctx)
  const commentInfo: any = await findCommentIsExist(ctx, body.id)
  let sql = `INSERT blog_comment_child (id, article_id, first_comment_id, reply_id, content, from_uid, to_uid, source, create_time) VALUES (?,?,?,?,?,?,?,?,?)`
  let data = [getUuId(), commentInfo.articleId, commentInfo.firstCommentId, commentInfo.replyId, body.content, _getUserId(ctx), commentInfo.toUid, source, getCurrentTime()]
  const res: any = await query(sql, data)
  if (res && res['affectedRows'])
    throw new global.Success()
  else throw new global.ExceptionHttp({ message: '评论失败' })
}

/**
 * 6 删除第一级别评论，自己作或管理员可删
*/
export async function doBlogCommentDeleteType1(ctx: Koa.Context, next?: any) {
  let commentId = ctx.data.query.id
  const userInfo: any = await _getUserInfo(ctx)
  let sqlPower = { sql: '', data: [] }
  if (userInfo.isAdmin != '1') {
    sqlPower.sql = 'AND (create_user = ? OR create_user = ?)'
    // @ts-ignore
    sqlPower.data = [userInfo.id, userInfo.openid]
  }
  let sql = `DELETE FROM blog_comment WHERE id = ? ${sqlPower.sql}`
  let data = [commentId, ...sqlPower.data]
  const res: any = await query(sql, data)
  // 删除子评论
  // if (res && res['affectedRows']) {
  //   let sql2 = `DELETE FROM blog_comment_child WHERE first_comment_id = ?`
  //   await query(sql2, commentId)
  // }
  throw new global.Success()
}

/**
 * 6 直接删除第二级别评论，自己作或管理员可删
*/
export async function doBlogCommentDeleteType2(ctx: Koa.Context, next?: any) {
  let commentId = ctx.data.query.id
  // 可删除权限
  const userInfo: any = await _getUserInfo(ctx)
  let sqlPower = { sql: '', data: [] }
  if (userInfo.isAdmin != '1') {
    sqlPower.sql = 'AND (create_user = ? OR create_user = ?)'
    // @ts-ignore
    sqlPower.data = [userInfo.id, userInfo.openid]
  }
  let sql = `DELETE FROM blog_comment_child WHERE id = ? ${sqlPower.sql}`
  await query(sql, commentId)
  throw new global.Success()
}

/**
 * 7 获取评论列表 1 评论列表
*/
export async function doBlogCommentListType1(ctx: Koa.Context, next?: any) {
  let queryData: any = ctx.data.query
  // 分页
  queryData.pageNo = queryData.pageNo * 1 || 1
  queryData.pageSize = queryData.pageSize * 1 || 10
  let pageNo = (queryData.pageNo - 1) * queryData.pageSize
  let sql1 = `SELECT COUNT(id) as total FROM blog_comment WHERE article_id = ?`
  let sql2 = `SELECT * FROM blog_comment WHERE article_id = ? ORDER BY create_time DESC LIMIT ?, ?`
  let queryParams = [
    { sql: sql1, data: queryData.id },
    { sql: sql2, data: [queryData.id, pageNo, queryData.pageSize] }
  ]
  const res: any = await execTrans(queryParams)
  let total = res[0][0]['total']
  let dataList = res[1]
  dataList = await handleCommentField(ctx, dataList) // 添加字段
  throw new global.Success({ data: dataList, total })
}

/**
 * 7 获取评论列表 2 回复评论的列表
*/
export async function doBlogCommentListType2(ctx: Koa.Context, next?: any) {
  let queryData: any = ctx.data.query
  // 分页
  queryData.pageNo = queryData.pageNo * 1 || 1
  queryData.pageSize = queryData.pageSize * 1 || 10
  let pageNo = (queryData.pageNo - 1) * queryData.pageSize
  let sql1 = `SELECT COUNT(id) as total FROM blog_comment_child WHERE first_comment_id = ?`
  let sql2 = `SELECT * FROM blog_comment_child WHERE first_comment_id = ? ORDER BY create_time DESC LIMIT ?, ?`
  let queryParams = [
    { sql: sql1, data: queryData.id },
    { sql: sql2, data: [queryData.id, pageNo, queryData.pageSize] }
  ]
  const res: any = await execTrans(queryParams)
  let total = res[0][0]['total']
  let dataList = res[1]
  dataList = await handleCommentField(ctx, dataList, '2') // 添加字段
  throw new global.Success({ data: dataList, total })
}