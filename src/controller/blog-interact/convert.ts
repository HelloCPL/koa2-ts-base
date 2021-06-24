/**
 * @description: 点赞 收藏 评论等用户交互模块 校验相关中间件
 * @author chen
 * @update 2021-06-22 15:10:36
*/

import Koa from 'koa'
import { query, execTrans } from '../../db'
import { getTerminalName, _getUserId, _getUserInfo, _getUserInfoById } from '../../utils/users'
import { validateRange } from '../../utils/validator'

/**
 * 判断是否已经点赞
*/
export async function judgeIsLike(ctx: Koa.Context, articleId: string) {
  const userInfo: any = await _getUserInfo(ctx)
  let sql = `SELECT id FROM blog_like WHERE article_id = ? AND (create_user = ? OR create_user = ?)`
  let data = [articleId, userInfo.id, userInfo.openid]
  const res: any = await query(sql, data)
  if (res && res.length) return true
  else return false
}

/**
 * 判断是否已经收藏
*/
export async function judgeIsCollection(ctx: Koa.Context, articleId: string) {
  const userInfo: any = await _getUserInfo(ctx)
  let sql = `SELECT id FROM blog_collection WHERE article_id = ? AND (create_user = ? OR create_user = ?)`
  let data = [articleId, userInfo.id, userInfo.openid]
  const res: any = await query(sql, data)
  if (res && res.length) return true
  else return false
}

/**
 * 校验评论类型 type
*/
export async function validateBlogCommentType(ctx: Koa.Context, next: any) {
  let type = ctx.data.body.type || ctx.data.query.type
  validateRange(type, ['1', '2'], 'type 参数有误')
  await next()
}

/**
 * 查找指定评论是否存在，存在 返回评论信息 不存在返回前端
*/
export async function findCommentIsExist(ctx: Koa.Context, commentId: string) {
  let sql1 = `SELECT * FROM blog_comment WHERE id = ?`
  const res: any = await query(sql1, commentId)
  if (res && res.length) {
    return {
      type: '1',
      articleId: res[0]['article_id'],
      firstCommentId: res[0]['id'],
      replyId: commentId,
      toUid: res[0]['from_uid']
    }
  } else {
    let sql2 = `SELECT * FROM blog_comment_child WHERE id = ?`
    const res2: any = await query(sql2, commentId)
    if (res2 && res2.length) {
      return {
        type: '2',
        articleId: res2[0]['article_id'],
        firstCommentId: res2[0]['first_comment_id'],
        replyId: commentId,
        toUid: res2[0]['from_uid']
      }
    } else throw new global.ExceptionNotFound({ message: '评论不存在' })
  }
}

/**
 * 删除指定文章所有评论，多个评论用逗号隔开
*/
export async function doBlogCommentDeleteByArticle(articleIds: string) {
  let sql1 = `DELETE FROM blog_comment WHERE FIND_IN_SET(article_id, ?)`
  let sql2 = `DELETE FROM blog_comment_child WHERE FIND_IN_SET(article_id, ?)`
  let data = [articleIds]
  let sqlParams = [
    { sql: sql1, data },
    { sql: sql2, data }
  ]
  await execTrans(sqlParams)
}

/**
 * 获取点赞总数
*/
export async function getLikeCount(articleId: string) {
  let sql = `SELECT COUNT(id) as total FROM blog_like WHERE article_id = ?`
  const res: any = await query(sql, articleId)
  return res[0]['total']
}

/**
 * 获取收藏总数
*/
export async function getCollectionCount(articleId: string) {
  let sql = `SELECT COUNT(id) as total FROM blog_collection WHERE article_id = ?`
  const res: any = await query(sql, articleId)
  return res[0]['total']
}

/**
 * 获取文章评论总数
*/
export async function getArticleCommentCount(articleId: string) {
  let sql1 = `SELECT COUNT(id) as total FROM blog_comment WHERE article_id = ?`
  let sql2 = `SELECT COUNT(id) as total FROM blog_comment_child WHERE article_id = ?`
  let sqlParams = [
    { sql: sql1, data: articleId },
    { sql: sql2, data: articleId }
  ]
  const res: any = await execTrans(sqlParams)
  return res[0][0]['total'] + res[1][0]['total']
}

/**
 * 获取第一级别评论总数
*/
export async function getCommentFirstCount(firstCommentId: string) {
  let sql = `SELECT COUNT(id) as total FROM blog_comment_child WHERE first_comment_id = ?`
  const res: any = await query(sql, firstCommentId)
  return res[0]['total']
}

/**
 * 评论列表添加
 * sourceName 来源名称 fromName 用户名称
 * isSelf 是否自己评论 isDelete 是否可删
 * isLike 是否点赞 likeCount 点赞总数 total 第二级别评论总数
*/
export async function handleCommentField(ctx: Koa.Context, data: any[], type: string = '1') {
  const userInfo: any = await _getUserInfo(ctx)
  for (let i = 0, len = data.length; i < len; i++) {
    // 来源名称
    data[i].sourceName = getTerminalName(data[i].source)
    // 用户名称
    let fromUser = await _getUserInfoById(data[i]['from_uid'], data[i].source)
    data[i].fromName = fromUser.userName
    // 是否自己
    if (data[i]['from_uid'] === userInfo.id || data[i]['from_uid'] === userInfo.openid)
      data[i]['isSelf'] = '1'
    else data[i]['isSelf'] = '0'
    // 是否可删
    if (data[i]['isSelf'] == '1' || userInfo.isAdmin == '1')
      data[i]['isDelete'] = '1'
    else data[i]['isDelete'] = '0'
    // 是否点赞 
    let isLike = await judgeIsLike(ctx, data[i].id)
    if (isLike) data[i].isLike = '1'
    else data[i].isLike = '0'
    // 点赞总数
    data[i].likeCount = await getLikeCount(data[i].id)
    if (type == '1') {
      // 第一级别评论总数
      data[i].total = await getCommentFirstCount(data[i].id)
      data[i].toUid = null
      data[i].toName = ''
    } else {
      // 第二级别评论
      data[i].total = 0
      if (data[i]['first_comment_id'] === data[i]['reply_id']) {
        data[i].toUid = null
        data[i].toName = ''
      } else {
        let toUser = await _getUserInfoById(data[i]['to_uid'], data[i].source)
        data[i].toName = toUser.userName
      }
    }
  }
  return data
}