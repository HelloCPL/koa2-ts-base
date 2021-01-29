/**
 * @description 测试路由
 * @author chen
 * @update 2021-01-22 14:59:12
*/

import Koa from 'koa'
import { Prefix, Get, Post, Required, Convert } from '../middlewares/router'

@Prefix('/myprefix')
export default class TestController {

  // @Post('/mytest/post', true)
  // @Required(['name&isBase64'])
  // async doTestPost(ctx: Koa.Context, next: any): Promise<void> {
  //   console.log('post');
  //   throw new global.Success({
  //     data: 'post 返回'
  //   })
  // }

}
