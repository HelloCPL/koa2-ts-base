/**
 * @description: 异常处理中间件
 * @author chen
 * @update 2021-01-20 10:22:18
*/

import Koa from 'koa'
import { ExceptionHttp, Success } from '../../utils/http-exception'

export async function catchError(ctx: Koa.Context, next: any) {
  try {
    await next()
  } catch (error) {
    const isExceptionHttp = error instanceof ExceptionHttp
    // const isDev = global.CONFIG.ENV === 'dev'
    // if (isDev && !isExceptionHttp) throw error
    throwError(error, isExceptionHttp)
    ctx.status = global.Code.success
    if (isExceptionHttp) {
      ctx.body = {
        code: error.code,
        message: error.message,
        data: error.data,
        total: error.total
      }
    } else {
      ctx.body = {
        code: global.Code.error,
        message: global.Code.error,
        data: null,
        total: 0
      }
    }
  }
}

function throwError(error: any, isExceptionHttp: boolean) {
  let isSuccess = error instanceof Success
  if (isSuccess) return
  if (isExceptionHttp) {
    console.log('');
    console.log('---------------- 已知错误 start -----------------');
    console.log(error);
    console.log('---------------- 已知错误 start -----------------');
    console.log('');
  } else {
    console.log('');
    console.log('---------------- 未知错误 start -----------------');
    console.log(error);
    console.log('---------------- 未知错误 start -----------------');
    console.log('');
  }
}


















