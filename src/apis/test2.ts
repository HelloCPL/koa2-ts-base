/**
 * @description 测试路由
 * @author chen
 * @update 2021-01-22 14:59:12
*/

import Koa from 'koa'
import { Prefix, Get, Post, Required, Convert } from '../middlewares/router'
import { symbolRoutePrefix } from '../middlewares/router/Route'

// 测试中间件
// async function testFun(ctx: Koa.Context, next: any) {
//   console.log('convert function');
//   await next()
// }

@Prefix('/myprefix')
class TestController {

  @Post('/mytest/post')
  @Required(['name&isBase64'])

  async doTestPost(ctx: Koa.Context, next: any): Promise<void> {
    console.log('post');
    console.log(ctx);
    throw new global.Success({
      data: 'post 返回'
    })
  }
}

export default TestController


















