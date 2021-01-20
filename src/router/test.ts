/**
 * @description: 测试路由
 * @author chen
 * @update 2021-01-19 14:30:36
*/

import Router from 'koa-router'
const router = new Router({
  prefix: '/api'
})

import { myTest } from '../model/test'

router.get('/test', myTest)

export default router



