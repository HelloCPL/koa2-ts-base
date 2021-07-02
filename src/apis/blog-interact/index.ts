/**
 * @description: 点赞 收藏 评论等用户交互
 * @author chen
 * @update 2021-06-22 15:05:33
*/

import Koa from 'koa'
import { Prefix, Get, Post, Required, Convert } from '../../middlewares/router'
import { doBlogLike, doBlogLikeCancel, doBlogCollection, doBlogCollectionCancel, doBlogCommentAddType1, doBlogCommentAddType2, doBlogCommentDeleteType1, doBlogCommentDeleteType2, doBlogCommentListType1, doBlogCommentListType2 } from '../../controller/blog-interact'
import { validateBlogCommentType, findCommentIsExist } from '../../controller/blog-interact/convert'

@Prefix('blog/interact')
export default class BlogInteractController {

  // 1 点赞 所有端口点赞同步，包括小程序
  @Get('like')
  @Required(['id'])
  async doBlogLike(ctx: Koa.Context, next: any) {
    await doBlogLike(ctx, next)
  }

  // 2 取消点赞
  @Get('like/cancel')
  @Required(['id'])
  async doBlogLikeCancel(ctx: Koa.Context, next: any) {
    await doBlogLikeCancel(ctx, next)
  }

  // 3 收藏 所有端口收藏同步，包括小程序
  @Get('collection')
  @Required(['id'])
  async doBlogCollection(ctx: Koa.Context, next: any) {
    await doBlogCollection(ctx, next)
  }

  // 4 取消收藏
  @Get('collection/cancel')
  @Required(['id'])
  async doBlogCollectionCancel(ctx: Koa.Context, next: any) {
    await doBlogCollectionCancel(ctx, next)
  }

  // 5 评论 type 1 第一级别评论 2 第二级别评论
  @Convert(validateBlogCommentType)
  @Post('comment/add')
  @Required(['id', 'type', 'content'])
  async doBlogCommentAdd(ctx: Koa.Context, next: any) {
    if (ctx.data.body.type == '1')
      await doBlogCommentAddType1(ctx, next)
    else
      await doBlogCommentAddType2(ctx, next)
  }

  // 6 删除评论 (作者或管理员可删)
  @Get('comment/delete')
  @Required(['id'])
  async doBlogCommentDelete(ctx: Koa.Context, next: any) {
    let commentId = ctx.data.query.id
    const commentInfo: any = await findCommentIsExist(ctx, commentId)
    if (commentInfo.type == '1')
      await doBlogCommentDeleteType1(ctx, next)
    else if (commentInfo.type == '2')
      await doBlogCommentDeleteType2(ctx, next)
  }

  // 7 获取评论列表 1 第一级别评论列表 2 第二级别评论列表
  @Convert(validateBlogCommentType)
  @Get('comment/list')
  @Required(['id', 'type'])
  async doBlogCommentList(ctx: Koa.Context, next: any) {
    if (ctx.data.query.type == '1')
      await doBlogCommentListType1(ctx, next)
    else
      await doBlogCommentListType2(ctx, next)
  }
}