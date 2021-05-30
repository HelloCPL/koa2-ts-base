/**
 * @description: 密码加密与解密 这里选择 crypto-js 亦可选择其他
 * @author chen
 * @update 2021-01-27 14:43:24
*/

import CryptoJS from 'crypto-js'

/**
 * crypto-js 加密方法
 * password 参数 keyStr 加密字符串 ivStr 加密字符串
*/
export function encrypt(password: any, keyStr?: string, ivStr?: string) {
  keyStr = keyStr ? keyStr : global.CONFIG.CRYPTOJS_KEY
  ivStr = ivStr ? ivStr : global.CONFIG.CRYPTOJS_IV
  let key = CryptoJS.enc.Utf8.parse(keyStr)
  let iv = CryptoJS.enc.Utf8.parse(ivStr)
  let srcs = CryptoJS.enc.Utf8.parse(password);
  return CryptoJS.AES.encrypt(srcs, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.ZeroPadding
  }).toString()
}

/**
 * crypto-js 解密方法
*/
export function decrypt(password: any, keyStr?: string, ivStr?: string) {
  if (!password) return password
  keyStr = keyStr ? keyStr : global.CONFIG.CRYPTOJS_KEY
  ivStr = ivStr ? ivStr : global.CONFIG.CRYPTOJS_IV
  let key = CryptoJS.enc.Utf8.parse(keyStr)
  let iv = CryptoJS.enc.Utf8.parse(ivStr)
  let descyptStr = CryptoJS.AES.decrypt(password, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.ZeroPadding
  })
  return descyptStr.toString(CryptoJS.enc.Utf8)
}
