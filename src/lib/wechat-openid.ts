/**
 * @description: 获取微信 openID
 * @author chen
 * @update 2021-03-04 15:05:20
*/

import axios from 'axios'
import CONFIG from '../config/index'
import { result } from 'lodash'

// 返回微信小程序 openid
export const codeToOpenId = async function (code: string) {
  const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${CONFIG.WX.APP_ID}&secret=${CONFIG.WX.APP_SECRET}&js_code=${code}&grant_type=authorization_code`
  const res = await axios.get(url)
  if (res.status !== 200)
    throw new global.ExceptionAuthFailed({ message: 'openId 获取失败' })
  if (res.data && res.data.errcode)
    throw new global.ExceptionAuthFailed({ message: `openId 获取失败：${res.data.errmsg}` })
  return res.data
}












