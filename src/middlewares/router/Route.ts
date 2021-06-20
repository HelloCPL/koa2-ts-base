/**
 * @description 路由统一注册
 * @author chen
 * @update 2021-01-22 16:09:11
 * @list 方法集合说明
 *   symbolRoutePrefix // 定义固定的前缀字段
 *   Route // 自动注册路由类
*/

import Koa from 'koa'
import Router from 'koa-router'
import path from 'path'
import glob from 'glob'
import { TokenAuth } from '../token-auth'
import { sureIsArray, toPath } from '../../utils/tools'


const router = new Router()

/**
 * 定义固定的前缀字段
*/
export const symbolRoutePrefix: symbol = Symbol("routePrefix");

/**
 * 自动注册路由类
*/
export class Route {
  // 存储修饰后的路由
  static __DecoratedRouters: Map<ObjectRoute, Function | Function[]> = new Map()
  private router: any
  private app: Koa

  constructor(app: Koa) {
    this.app = app
    this.router = router
  }

  /**
   * 自动注册路由 初始化
  */
  init() {
    // 加载 api 接口
    glob.sync(path.join(__dirname, '../../apis/**/*.js')).forEach(item => {
      require(item)
    })
    let unlessPath: string[] = [] // 不拦截的路由集合
    // 循环配置路由
    for (let [config, controller] of Route.__DecoratedRouters) {
      let controllers: any[] = sureIsArray(controller)
      let prefixPath = config.target[symbolRoutePrefix]
      // 拼接路由集合
      let routerPaths: string[] = []
      config.terminals.forEach(value => {
        routerPaths.push(toPath(value, prefixPath, config.path))
      })
      // 忽略的路由
      if (config.unless)
        unlessPath = unlessPath.concat(routerPaths)
      controllers.forEach(controller => {
        routerPaths.forEach(routerPath => {
          this.router[config.method](routerPath, controller)
        })
      })
    }
    // 路由载入前进行token权限判断
    // this.app.use(auth.m)
    this.app.use(TokenAuth(unlessPath))
    this.app.use(this.router.routes())
    this.app.use(this.router.allowedMethods())
  }
}
