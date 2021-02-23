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
      // 返回前打印请求结束信息
      global.requestEnd = process.hrtime.bigint()
      let costTime = global.requestEnd - global.requestStart
      console.log('');
      console.log(`请求结束时间：${global.dayjs().format('YYYY-MM-DD HH:mm:ss')}`);
      console.log(`请求花费时间：${costTime}纳秒（即${Number(costTime)/1e3}微秒 ${Number(costTime)/1e6}毫秒 ${Number(costTime)/1e9}秒）`);
      console.log(`------------------- 请求结束 ${global.requestCount} -----------------`);
      console.log('');
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

// 打印捕捉的错误
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


















