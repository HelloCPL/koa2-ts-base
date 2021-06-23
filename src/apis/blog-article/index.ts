/**
 * @description: 博客文件相关
 * @author chen
 * @update 2021-03-10 14:52:00
*/



import Koa from 'koa'
import { Prefix, Get, Post, Required, Convert } from '../../middlewares/router'
import { doBlogAdd, doBlogEdit, doBlogDeletes, doBlogInfo, doBlogListSelf } from '../../controller/blog-article'
import { validateBlogParamsAddOrEdit, validateDeleteIsPower, validateInfoIsPower } from '../../controller/blog-article/convert'

@Prefix('blog/article')
export default class BlogArticleController {

  // 1 新增博客文章
  @Convert(validateBlogParamsAddOrEdit)
  @Post('add')
  @Required(['content', 'type&isInt'])
  async doBlogAdd(ctx: Koa.Context, next: any) {
    await doBlogAdd(ctx, next)
  }

  // 2 编辑博客文章（作者或管理员可编辑）
  @Convert(validateBlogParamsAddOrEdit)
  @Post('edit')
  @Required(['id'])
  async doBlogEdit(ctx: Koa.Context, next: any) {
    await doBlogEdit(ctx, next)
  }

  // 3 删除博客文章，多个用逗号隔开（作者或管理员可删）
  @Convert(validateDeleteIsPower)
  @Get('deletes')
  @Required(['ids'])
  async doBlogDeletes(ctx: Koa.Context, next: any) {
    await doBlogDeletes(ctx, next)
  }

  // 4 获取指定博客文章（isSecret=1 隐私文章仅作者或管理员可查看）
  @Convert(validateInfoIsPower)
  @Get('info')
  @Required(['id'])
  async doBlogInfo(ctx: Koa.Context, next: any) {
    await doBlogInfo(ctx, next)
  }

  // 5 获取个人博客文章列表
  @Get('list/self')
  @Required()
  async doBlogListSelf(ctx: Koa.Context, next: any) {
    await doBlogListSelf(ctx, next)
  }


}
