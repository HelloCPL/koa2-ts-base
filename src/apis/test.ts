/**
 * @description 测试路由
 * @author chen
 * @update 2021-01-22 14:59:12
*/

import Koa from 'koa'
import { Prefix, Get, Post, Required, Convert } from '../middlewares/router'
import { symbolRoutePrefix } from '../middlewares/router/Route'

// 测试中间件
async function testFun(ctx: Koa.Context, next: any) {
  console.log('convert function 1');
  // throw new global.ExceptionHttp({
  //   message: 'zhongjianna'
  // })
  await next()
}

async function testFun2(ctx: Koa.Context, next: any) {
  console.log('convert function 2');
  await next()
}

@Prefix('/myprefix')
class TestController {
  @Convert(testFun)

  @Get('/mytest/get')
  @Required(['id', 'name'])
  async doTestGet(ctx: Koa.Context, next: any): Promise<void> {
    console.log('get');
    throw new global.Success({
      data: 'get 返回'
    })
  }

}

export default TestController


















