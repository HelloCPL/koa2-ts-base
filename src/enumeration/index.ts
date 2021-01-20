/**
 * @description: 全局枚举
 * @author chen
 * @update 2021-01-20 11:20:09
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

export enum Code {
  error = 500,
  parameter = 400,
  notFound = 404,
  forbidden = 403,
  authFailed = 401,
  success = 200
}