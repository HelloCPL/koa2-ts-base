/**
 * @description: 用户模块相关路由
 * @author chen
 * @update 2021-01-27 11:10:43
*/

import Koa from 'koa'
import { Prefix, Get, Post, Required, Convert } from '../../middlewares/router'
import { doUserRegister, doUserLogin, doUserLoginWeChat, doUserTokenRefresh, getUserInfoSelfWeChat, getUserInfoById, doUserExit, doUserEditById, doUserEditAvatarSelf } from '../../controller/users'
import { doUserRegisterIsExist, doUserLoginIsNotExist } from '../../controller/users/convert'
import { doFileUploadImgOne } from '../../controller/file-operate'

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
  @Required()
  async doUserTokenRefresh(ctx: Koa.Context, next: any) {
    await doUserTokenRefresh(ctx, next)
  }

  // 用户退出
  @Get('exit')
  @Required()
  async doUserExit(ctx: Koa.Context, next: any) {
    await doUserExit(ctx, next)
  }

  // 获取本用户信息
  @Get('info/self', false, ['management', 'pc', 'mobile', 'app'])
  @Required()
  async getUserInfoSelf(ctx: Koa.Context, next: any) {
    let id = ctx.user.id
    await getUserInfoById(ctx, next, id)
  }

  // 获取本用户信息(小程序用户)
  @Get('info/self', false, ['wechat'])
  @Required()
  async getUserInfoSelfWeChat(ctx: Koa.Context, next: any) {
    await getUserInfoSelfWeChat(ctx, next)
  }

  // 获取指定用户信息，小程序没有获取指定用户的接口
  @Get('info', false, ['management', 'pc', 'mobile', 'app'])
  @Required(['id'])
  async getUserInfoById(ctx: Koa.Context, next: any) {
    let id = ctx.data.query.id
    await getUserInfoById(ctx, next, id)
  }

  // 完善本用户信息（小程序除外）
  @Post('edit/self', false, ['management', 'pc', 'mobile', 'app'])
  @Required()
  async doUserEditSelf(ctx: Koa.Context, next: any) {
    let id = ctx.user.id
    await doUserEditById(ctx, next, id)
  }

  // 完善指定用户信息（仅管理端可用）
  @Post('edit', false, ['management'])
  @Required(['id'])
  async doUserEditById(ctx: Koa.Context, next: any) {
    let id = ctx.data.body.id
    await doUserEditById(ctx, next, id)
  }

  // 完善本用户信息 -- 更换用户头像（仅 pc mobile app 可用）
  @Post('edit/avatar/self', false, ['pc', 'mobile', 'app'])
  @Required()
  async doUserEditAvatarSelf(ctx: Koa.Context, next: any) {
    const file = await doFileUploadImgOne(ctx, next)
    await doUserEditAvatarSelf(ctx, next, file)
  }
}
