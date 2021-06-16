/**
 * @description: 用户小程序相关
 * @author chen
 * @update 2021-06-16 14:26:55
*/

import Koa from 'koa'
import { Prefix, Get, Post, Required, Convert } from '../../middlewares/router'
import { doUserLoginWeChat, getUserInfoSelfWeChat, doUserInfoAssociateWeChat } from '../../controller/users-wechat'
import { doUserLoginIsNotExist } from '../../controller/users/convert'

@Prefix('wx/users')
export default class UsersController {
  // 3 用户登录（微信小程序用户）
  @Post('login', true, ['wechat'])
  @Required(['code'])
  async doUserLoginWeChat(ctx: Koa.Context, next: any) {
    await doUserLoginWeChat(ctx, next)
  }

  // 7 获取本用户信息(小程序用户)
  @Get('info/self', false, ['wechat', 'pc'])
  @Required()
  async getUserInfoSelfWeChat(ctx: Koa.Context, next: any) {
    await getUserInfoSelfWeChat(ctx, next)
  }

  // 12 关联用户账号(仅小程序用户)
  @Convert(doUserLoginIsNotExist)
  @Post('info/associate', false, ['wechat'])
  @Required(['phone', 'word-info'])
  async doUserInfoAssociateWeChat(ctx: Koa.Context, next: any) {
    await doUserInfoAssociateWeChat(ctx, next)
  }

}