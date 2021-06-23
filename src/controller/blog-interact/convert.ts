/**
 * @description: 点赞 收藏 评论等用户交互模块 校验相关中间件
 * @author chen
 * @update 2021-06-22 15:10:36
*/

import Koa from 'koa'
import { query } from '../../db'
import { getUserId, getUserInfo } from '../../utils/users'
import { validateRange } from '../../utils/validator'

/**
 * 判断是否已经点赞
*/
export async function judgeIsLike(ctx: Koa.Context, articleId: string) {
  const userInfo: any = await getUserInfo(ctx)
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
  const userInfo: any = await getUserInfo(ctx)
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