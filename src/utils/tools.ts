/**
 * @description 封装常用方法
 * @author chen
 * @update 2021-01-25 16:03:11
*/

import Koa from 'koa'

/**
 * 返回格式后的路径
 * 如 member/list 或 member/list/ ==> /member/list
*/
function toPath(...arg: string[]) {
  let getPath = (path: string) => {
    if (!path) return ''
    if (!path.startsWith('/'))
      path = '/' + path
    if (path.endsWith('/'))
      path = path.substring(0, path.length - 1)
    return path
  }
  return arg.map(item => getPath(item)).join('')
}

/**
 * 确保返回数组集合方法
*/
function sureIsArray(arr: any): any[] {
  return Array.isArray(arr) ? arr : [arr]
}

/**
 * 获取请求终端
*/
function getTerminal(ctx: Koa.Context) {
  let method = ctx.request.url
  return method.substring(1, method.indexOf('/', 1)).toLocaleUpperCase()
}

/**
 * 获取请求设备信息
*/
function getUserAgent(ctx: Koa.Context) {
  return ctx.request.header['user-agent']
}

/**
 * 将 key 名称转换成 驼峰命名
*/
function toCamelCase(results: any) {
  // 处理对象 key
  let toObjectKey = (obj: ObjectAny) => {
    let newObj: ObjectAny = {}
    for (let key in obj) {
      if (isObject(obj[key]))
        newObj[global._.camelCase(key)] = toObjectKey(obj[key])
      else if (global._.isArray(obj[key]))
        newObj[global._.camelCase(key)] = toArrayKey(obj[key])
      else
        newObj[global._.camelCase(key)] = obj[key]
    }
    return newObj
  }
  // 处理数组 key
  let toArrayKey = (arr: ArrayAny) => {
    for (let i = 0, len = arr.length; i < len; i++) {
      if (global._.isArray(arr[i]))
        arr[i] = toArrayKey(arr[i])
      else if (isObject(arr[i]))
        arr[i] = toObjectKey(arr[i])
    }
    return arr
  }
  if (global._.isArray(results))
    return toArrayKey(results)
  else if (isObject(results))
    return toObjectKey(results)
  return results
}

/**
 * 判断是否为对象，补充 lodash 不能识别数据库查询返回的数据是否为对象的问题
*/
function isObject(obj: any) {
  return global._.isPlainObject(obj) || (typeof obj === 'object' && toString.call(obj) === '[object Object]')
}

export default {
  toPath,
  sureIsArray,
  getTerminal,
  getUserAgent,
  toCamelCase,
  isObject
}