/**
 * @description 对 koa ctx 追加参数
 * @author chen
 * @update 2021-01-22 15:06:16
*/

import Koa from 'koa'
import compose from 'koa-compose'

declare module 'koa' {
  interface Context {
    state: any, // 回调状态码
    data: {
      query: ObjectAny,
      body: ObjectAny,
      path: ObjectAny,
      header: ObjectAny,
    } | any, // 访问参数
    terminal: any, // 访问终端
    userInfo: any // 用户信息
  }
}