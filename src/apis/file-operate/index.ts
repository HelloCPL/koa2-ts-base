/**
 * @description: 文件操作模块相关路由
 * @author chen
 * @update 2021-01-27 11:10:43
*/

import Koa from 'koa'
import { Prefix, Get, Post, Required, Convert } from '../../middlewares/router'
import { doFileUpload, doFileDelete } from '../../controller/file-operate'
import { doFileDeleteIsPower } from '../../controller/file-operate/convert'

@Prefix('file')
export default class MulterController {

  // 文件文件上传 可上传一个或多个文件 返回数组格式
  // 可选参数 secret 是否设为私密
  @Post('upload')
  async doFileUpload(ctx: Koa.Context, next: any) {
    await doFileUpload(ctx, next)
  }

  // 文件删除 传 ids 可删除多个 用逗号隔开
  @Convert(doFileDeleteIsPower)
  @Get('delete')
  @Required(['ids'])
  async doFileDelete(ctx: Koa.Context, next: any) {
    await doFileDelete(ctx, next)
  }

}
