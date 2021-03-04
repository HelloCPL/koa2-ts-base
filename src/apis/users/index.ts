/**
 * @description: 用户模块相关路由
 * @author chen
 * @update 2021-01-27 11:10:43
*/

import Koa from 'koa'
import { Prefix, Get, Post, Required, Convert } from '../../middlewares/router'
import { doUserRegister, doUserLogin, doUserLoginWeChat, doUserTokenRefresh, getUserInfoSelf, getUserInfoSelfWeChat, getUserInfoById, doUserExit } from '../../controller/users'
import { doUserRegisterIsExist, doUserLoginIsNotExist } from '../../controller/users/convert'

@Prefix('users')
export default class UsersController {

  // 用户注册
  @Convert(doUserRegisterIsExist)
  @Post('register', true, ['management', 'pc', 'mobile', 'app'])
  @Required(['phone', 'word-info'])
  async doUserRegister(ctx: Koa.Context, next: any) {
    await doUserRegister(ctx, next)
  }

  // 用户登录
  @Convert(doUserLoginIsNotExist)
  @Post('login', true, ['management', 'pc', 'mobile', 'app'])
  @Required(['phone', 'word-info'])
  async doUserLogin(ctx: Koa.Context, next: any) {
    await doUserLogin(ctx, next)
  }

  // 用户登录（微信小程序用户）
  @Post('login', true, ['wechat'])
  @Required(['code'])
  async doUserLoginWeChat(ctx: Koa.Context, next: any) {
    await doUserLoginWeChat(ctx, next)
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
  @Get('info/self', false, ['management', 'pc', 'mobile', 'app'])
  async getUserInfoSelf(ctx: Koa.Context, next: any) {
    await getUserInfoSelf(ctx, next)
  }

  // 获取本用户信息(小程序用户)
  @Get('info/self', false, ['wechat'])
  async getUserInfoSelfWeChat(ctx: Koa.Context, next: any) {
    await getUserInfoSelfWeChat(ctx, next)
  }

  // 获取指定用户信息
  @Get('info', false, ['management', 'pc', 'mobile', 'app'])
  @Required(['id'])
  async getUserInfoById(ctx: Koa.Context, next: any) {
    await getUserInfoById(ctx, next)
  }

}
