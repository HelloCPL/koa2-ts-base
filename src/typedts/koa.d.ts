/**
 * @description 对 koa ctx 追加参数
 * @author chen
 * @update 2021-01-22 15:06:16
*/

import Koa from 'koa'
import compose from 'koa-compose'

interface DataOption {
  [x: string]: any
}

declare module 'koa' {
  interface Context {
    state: any,
    data: {
      query: DataOption,
      body: DataOption,
      path: DataOption,
      header: DataOption,
    } | any
  }
}
