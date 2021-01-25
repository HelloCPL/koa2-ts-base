/**
 * @description: 全局枚举
 * @author chen
 * @update 2021-01-20 11:20:09
*/

/**
 * 返回数据信息提示
*/

export enum Message {
  error = '服务器发生错误',
  parameter = '参数错误',
  notFound = '资源不存在',
  forbidden = '权限不足',
  authFailed = '授权失败',
  rules = '服务器发生错误，校验规则有误',
  success = '操作成功'
}

/**
 * 返回数据状态码
*/

export enum Code {
  error = 500,
  parameter = 400,
  notFound = 404,
  forbidden = 403,
  authFailed = 401,
  success = 200
}

/**
 * 必传参数不满足条件时提示文本
 * 这里只列举常用的校验格式提示，更多请参考 validator 校验插件官网
*/
export enum ParamsMessage {
  isLength = '参数必传',
  isString = '参数必须为字符串',
  isBoolean = '参数必须为boolean类型',
  isInt = '参数必须为整型',
  isFloat = '参数必须为浮点型',
  isEmail = '参数必须为邮箱格式',
  isBase64 = '参数必须为base64格式',
  isDataURI = '参数必须为DataURI格式', // 即图片经baseXX编码后的字符串
  isURL = '参数必须为URL格式',
  isJWT = '参数必须为JWT token格式',
}