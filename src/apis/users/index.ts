/**
 * @description: 用户模块相关路由
 * @author chen
 * @update 2021-01-27 11:10:43
*/

import Koa from 'koa'
import { Prefix, Get, Post, Required, Convert } from '../../middlewares/router'
import { doUserRegister, doUserLogin, doUserTokenRefresh, getUserInfo, doUserExit } from '../../controller/users'
import { doUserRegisterIsExist, doUserLoginIsNotExist } from '../../controller/users/convert'

@Prefix('users')
export default class UsersController {

  // 用户注册
  @Convert(doUserRegisterIsExist)
  @Post('register', true)
  @Required(['phone', 'word-info'])
  async doUserRegister(ctx: Koa.Context, next: any) {
    await doUserRegister(ctx, next)
  }

  // 用户登录
  @Convert(doUserLoginIsNotExist)
  @Post('login', true)
  @Required(['phone', 'word-info'])
  async doUserLogin(ctx: Koa.Context, next: any) {
    await doUserLogin(ctx, next)
  }

  // 刷新 token 
  @Get('token/refresh', true)
  async doUserTokenRefresh(ctx: Koa.Context, next: any) {
    await doUserTokenRefresh(ctx, next)
  }

  // 用户退出
  @Get('exit')
  async doUserExit(ctx: Koa.Context, next: any) {
    await doUserExit(ctx, next)
  }

  // 获取本用户信息
  @Get('info')
  async getUserInfo(ctx: Koa.Context, next: any) {
    await getUserInfo(ctx, next)
  }
  
}
