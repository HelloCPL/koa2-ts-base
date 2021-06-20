/**
 * @description: 博客文件相关
 * @author chen
 * @update 2021-03-10 14:52:00
*/



import Koa from 'koa'
import { Prefix, Get, Post, Required, Convert } from '../../middlewares/router'
import { doBlogList } from '../../controller/blog-article'

@Prefix('blog/article')
export default class BlogArticleController {

  // 1 新增博客文章
  @Post('add')
  @Required()
  async doBlogList(ctx: Koa.Context, next: any) {
    await doBlogList(ctx, next)
  }

}
