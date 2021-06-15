/**
 * @description: 项目入口
 * @author chen
 * @update 2021-01-19 14:30:48
*/

import Koa from 'koa'
import http from 'http'
import InitManager from './init'
import CONFIG from './config/index'

const app = new Koa()

// 初始化项目
new InitManager(app)

// 设置监听
http.createServer(app.callback()).listen(CONFIG.PORT, () => {
  console.log(`${CONFIG.BASE_URL} is running...\n`);
})
