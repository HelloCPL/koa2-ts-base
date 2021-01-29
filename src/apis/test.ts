/**
 * @description 测试路由
 * @author chen
 * @update 2021-01-22 14:59:12
*/

import Koa from 'koa'
import { Prefix, Get, Post, Required, Convert } from '../middlewares/router'

async function tt(ctx: Koa.Context, next: any) {
console.log('tt');
await next()

}

@Prefix('/myprefix')
export default class TestController {

  // @Get('/mytest/get', true, ['pc'])
  // @Required(['id', 'name'])
  // @Convert(tt)
  // async doTestGet(ctx: Koa.Context, next: any): Promise<void> {
  //   console.log('get');
  //   throw new global.Success({
  //     data: 'get 返回'
  //   })
  // }

}
