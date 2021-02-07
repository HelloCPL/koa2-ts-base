/**
 * @description: 项目初始化
 * @author chen
 * @update 2021-01-19 14:51:43
*/

import Koa from 'koa'
import path from 'path'
import KoaCors from '@koa/cors'
import KoaBody from 'koa-body'
import KoaStatic from 'koa-static'
import { catchError } from './middlewares/exception'
import InitGlobal from './global'
import { Route } from './middlewares/router/Route'

class InitManager {
  constructor(public app: Koa) {
    this.init()
  }

  // 项目初始化
  init() {
    // 处理跨域
    this.app.use(KoaCors())
    // 处理body参数，并用于文件上传插件
    this.app.use(KoaBody({
      multipart: true,
      formidable: {
        maxFieldsSize: 20 * 1024 * 1024 // 设置上传文件大小最大限制，默认20M
      }
    }))
    // 初始化全局方法或变量
    InitGlobal.init()
    // 全局异常捕获
    this.app.use(catchError)
    // 初始化路由
    const router = new Route(this.app)
    router.init()
    // 初始化静态资源
    this.initStatic()
  }

  /**
   * 初始化静态资源
   * 访问如 http://localhost:3000/files/395d00a0-6918-11eb-a413-3be76f9212d3.jpg
  */
  initStatic() {
    const pathStatic = path.join(__dirname, '../static/')
    this.app.use(KoaStatic(pathStatic))
  }
}

export default InitManager
