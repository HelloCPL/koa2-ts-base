/**
 * @description: 路由导出
 * @author chen
 * @update 2021-01-19 14:14:21
*/

import Router from 'koa-router'
import RequireDirectory from 'require-directory'
import path from 'path'

class InitLoadRoutes {
  constructor() { }

  // 初始化路由
  init(app) {
    let routerPath = path.join(__dirname, './')
    RequireDirectory(module, routerPath, {
      visit: loadRouterModule
    })

    // 动态加载路由
    function loadRouterModule(obj) {
      if (obj instanceof Router)
        app.use(obj.routes())
      else if (obj.router && obj.router instanceof Router)
        app.use(obj.router.routes())
      else if (obj.default && obj.default instanceof Router)
        app.use(obj.default.routes())
    }
  }
}

export default new InitLoadRoutes()