/**
 * @description 路由统一注册
 * @author chen
 * @update 2021-01-22 16:09:11
*/

import Koa from 'koa'
import Router from 'koa-router'
import path from 'path'
import glob from 'glob'

const router = new Router()

// 定义固定的前缀字段
export const symbolRoutePrefix: symbol = Symbol("routePrefix");

/**
 * @author chen
 * @params 路由统一注册
 * @description 
 * @update 2021-01-22 17:25:25
*/
export interface RouterMap {
  target: any,
  method: string,
  path: string,
  unless?: boolean,
  terminals?: string[]
}

/**
 * 自动注册路由类
*/
export class Route {
  // 存储修饰后的路由
  static __DecoratedRouters: Map<RouterMap, Function | Function[]> = new Map()
  private router: any
  private app: Koa

  constructor(app: Koa) {
    this.app = app
    this.router = router
  }

  /**
   * @author chen
   * @params 
   * @description 注册路由
   * @update 2021-01-23 15:27:13
  */
  init() {
    // 加载 api 接口
    glob.sync(path.join(__dirname, '../../apis/*.js')).forEach(item => {
      require(item)
    })
    // 不拦截的路由集合
    let unlessPath = []
    // 循环配置路由
    for (let [config, controller] of Route.__DecoratedRouters) {
      let controllers = Array.isArray(controller) ? controller : [controller]
      let prefixPath = config.target[symbolRoutePrefix]
      // 拼接路由
      let routerPath = global.tools.toPath(prefixPath) + global.tools.toPath(config.path)
      // 忽略的路由
      if (config.unless)
        unlessPath.push(routerPath)
      controllers.forEach(controller => this.router[config.method](routerPath, controller))
    }
    // 路由载入前进行token权限判断
    // this.app.use(Auth(unlessPath))
    this.app.use(this.router.routes())
    this.app.use(this.router.allowedMethods())
  }
}
