/**
 * @description: 文件操作模块相关路由
 * @author chen
 * @update 2021-01-27 11:10:43
*/

import Koa from 'koa'
import { Prefix, Get, Post, Required, Convert } from '../../middlewares/router'
import { doMulterFilterUpload } from '../../controller/multer'

@Prefix('multer')
export default class MulterController {

  // 文件上传
  @Post('file/upload', true)
  async doMulterFilterUpload(ctx: Koa.Context, next: any) {
    await doMulterFilterUpload(ctx, next)
  }

  
}
