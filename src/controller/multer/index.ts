/**
 * @description: 文件上传模块 业务处理
 * @author chen
 * @update 2021-02-05 16:59:01
*/

import Koa from 'koa'
import { query, execTrans } from '../../db'

/**
 * 文件上传
*/
export async function doMulterFilterUpload(ctx: Koa.Context, next?: any) {
  for(let i = 1; i < 50; i++) {
    console.log(global.tools.getUuId());
    
  }
  throw new global.Success({
    message: '恭喜，注册成功！'
  })
}
