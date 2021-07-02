/**
 * @description: 文章模块 校验相关中间件
 * @author chen
 * @update 2021-06-21 16:18:00
*/

import Koa from 'koa'
import { query } from '../../db'
import { validateRange } from '../../utils/validator'
import { _getUserInfo, _getUserInfoById, getTerminalName } from '../../utils/users'
import { judgeIsLike, judgeIsCollection, getLikeCount, getCollectionCount, getArticleCommentCount } from '../blog-interact/convert'

/**
 * 新增编辑时自定义校验参数 type isLogin isSecret isDraft isTop isHot
*/
export async function validateBlogParamsAddOrEdit(ctx: Koa.Context, next: any) {
  let body: any = ctx.data.body
  validateRange(body.type, ['1', '2', '3'], 'type 参数有误')
  validateRange(body.isLogin, ['0', '1'], 'isLogin 参数有误')
  validateRange(body.isSecret, ['0', '1'], 'isSecret 参数有误')
  validateRange(body.isDraft, ['0', '1'], 'isDraft 参数有误')
  validateRange(body.isTop, ['0', '1'], 'isTop 参数有误')
  validateRange(body.isHot, ['0', '1'], 'isHot 参数有误')
  let isTop = body.isTop
  let isHot = body.isHot
  // 只有管理员才能指定
  if (isTop == '1' || isHot == '1') {
    const userInfo = await _getUserInfo(ctx)
    if (userInfo.isAdmin != '1') throw new global.ExceptionAuthFailed({ message: 'isHot isTop 只有管理员才能修改' })
  }
  await next()
}

/**
 * 校验是否有权限删除文章（作者或管理员）
*/
export async function validateDeleteIsPower(ctx: Koa.Context, next: any) {
  const userInfo = await _getUserInfo(ctx)
  const sql = `SELECT id, create_user FROM blog_article WHERE FIND_IN_SET(id, ?)`
  let res: any = await query(sql, ctx.data.query.ids)
  res = res.filter((item: any) => {
    return !(item.create_user === userInfo.id || item.create_user === userInfo.openid || userInfo.isAdmin == '1')
  })
  if (res.length) {
    let illegal = res.map((item: any) => item.id).join(',')
    throw new global.ExceptionParameter({
      message: `你没有权限删除“${illegal}”这${res.length}条数据`
    })
  }
  await next()
}

/**
 * 校验是否有权限查看指定文章（isSecret=1 隐私文章仅作者或管理员可查看）
*/
export async function validateInfoIsPower(ctx: Koa.Context, next: any) {
  let sql = `SELECT is_secret, create_user FROM blog_article WHERE id = ?`
  let res: any = await query(sql, ctx.data.query.id)
  if (res && res.length) {
    res = res[0]
    if (res.is_secret == 1) {
      const userInfo = await _getUserInfo(ctx)
      if (!(userInfo.id === res.create_user || userInfo.openid === res.create_user || userInfo.isAdmin == '1')) {
        throw new global.ExceptionForbidden({ message: '你没有权限查看该文章' })
      }
    }
  }
  await next()
}

/**
 * 查询详情或列表时添加 
 * sourceName 来源名称 createUserName 用户名称
 * isLike 是否点赞 isCollection 是否收藏
 * likeCount 点赞总数 collectionCount 收藏总数 commentCount 文章评论总数 
*/
export async function handleArticleField(ctx: Koa.Context, data: any[]) {
  for (let i = 0, len = data.length; i < len; i++) {
    // 来源名称
    data[i].sourceName = getTerminalName(data[i].source)
    // 用户名称
    let targetUser = await _getUserInfoById(data[i]['create_user'], data[i].source)
    data[i].createUserName = targetUser.userName
    // 是否点赞 
    let isLike = await judgeIsLike(ctx, data[i].id)
    if (isLike) data[i].isLike = '1'
    else data[i].isLike = '0'
    // 是否收藏
    let isCollection = await judgeIsCollection(ctx, data[i].id)
    if (isCollection) data[i].isCollection = '1'
    else data[i].isCollection = '0'
    // 点赞总数
    data[i].likeCount = await getLikeCount(data[i].id)
    // 收藏总数
    data[i].collectionCount = await getCollectionCount(data[i].id)
    // 文章评论总数
    data[i].commentCount = await getArticleCommentCount(data[i].id)
  }
  return data
}