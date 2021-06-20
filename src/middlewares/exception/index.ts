/**
 * @description: 异常处理中间件
 * @author chen
 * @update 2021-01-20 10:22:18
 * @list 方法集合说明
 *   catchError // 全局捕捉异常集合
*/

import Koa from 'koa'
import { ExceptionHttp, Success } from '../../global/http-exception'
// import CONFIG from '../../config/index'
import Logger from '../../utils/logs'

/**
 * 全局捕捉异常集合
*/
export async function catchError(ctx: Koa.Context, next: any) {
  try {
    await next()
  } catch (error) {
    const isExceptionHttp = error instanceof ExceptionHttp
    // const isDev = CONFIG.ENV === 'dev'
    // if (isDev && !isExceptionHttp) throw error
    throwError(error, isExceptionHttp)
    ctx.status = global.Code.success
    if (isExceptionHttp) {
      let data = {
        code: error.code,
        message: error.message,
        data: error.data,
        total: error.total
      }
      if (error.code !== global.Code.locked)
        Logger.response(ctx, data)
      ctx.body = data
    } else {
      let data = {
        code: global.Code.error,
        message: global.Code.error,
        data: null,
        total: 0
      }
      Logger.response(ctx, data)
      ctx.body = data
    }
  }
}

// 打印捕捉的错误
function throwError(error: any, isExceptionHttp: boolean) {
  let isSuccess = error instanceof Success
  if (isSuccess) return
  if (isExceptionHttp) {
    Logger.error('已知错误', error, '已知错误')
  } else {
    Logger.error('未知错误', error, '未知错误')
  }
}


















