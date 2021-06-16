/**
 * @description 封装常用方法
 * @author chen
 * @update 2021-01-25 16:03:11
 * @list 方法集合说明
 *   toPath // 返回格式后的路径
 *   sureIsArray // 确保返回数组集合方法
 *   getTerminal // 获取请求终端
 *   toCamelCase // 将 key 名称转换成 驼峰命名
 *   isObject // 判断是否为对象
 *   getUuId // 生成唯一id标识
 *   getFileRandomName // 生成文件随机名字
 *   getCurrentTime // 返回当前时间（或指定时间）
 *   formatDate // 格式化日期
*/

import Koa from 'koa'
import { v1 as uuidv1, v4 as uuidv4 } from 'uuid'
import _ from 'lodash'
import dayjs from 'dayjs'

/**
 * 返回格式后的路径
 * 如 member/list 或 member/list/ ==> /member/list
*/
export function toPath(...arg: string[]) {
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
export function sureIsArray(arr: any): any[] {
  return Array.isArray(arr) ? arr : [arr]
}

/**
 * 获取请求终端
*/
export function getTerminal(ctx: Koa.Context) {
  if (ctx.request.header['word-terminal']) return ctx.request.header['word-terminal'].toLocaleUpperCase()
  let method = ctx.request.url
  return method.substring(1, method.indexOf('/', 1)).toLocaleUpperCase()
}

/**
 * 将 key 名称转换成 驼峰命名
*/
export function toCamelCase(results: any) {
  // 处理对象 key
  let toObjectKey = (obj: ObjectAny) => {
    let newObj: ObjectAny = {}
    for (let key in obj) {
      if (isObject(obj[key]))
        newObj[_.camelCase(key)] = toObjectKey(obj[key])
      else if (_.isArray(obj[key]))
        newObj[_.camelCase(key)] = toArrayKey(obj[key])
      else
        newObj[_.camelCase(key)] = obj[key]
    }
    return newObj
  }
  // 处理数组 key
  let toArrayKey = (arr: any[]) => {
    for (let i = 0, len = arr.length; i < len; i++) {
      if (_.isArray(arr[i]))
        arr[i] = toArrayKey(arr[i])
      else if (isObject(arr[i]))
        arr[i] = toObjectKey(arr[i])
    }
    return arr
  }
  if (_.isArray(results))
    return toArrayKey(results)
  else if (isObject(results))
    return toObjectKey(results)
  return results
}

/**
 * 判断是否为对象，补充 lodash 不能识别数据库查询返回的数据是否为对象的问题
*/
export function isObject(obj: any) {
  return _.isPlainObject(obj) || (typeof obj === 'object' && toString.call(obj) === '[object Object]')
}

// 生成唯一id标识
export function getUuId() {
  return uuidv4()
}

// 生成文件随机名字
export function getFileRandomName(fileName: string) {
  let i = fileName.lastIndexOf('.')
  let suffix = ''
  if (i !== -1) suffix = fileName.substring(i)
  return uuidv1() + suffix
}

// 返回当前时间（或指定时间）
export function getCurrentTime(date?: any) {
  date = date || new Date()
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
}

// 格式化日期
export function formatDate(date: any, format = 'YYYY-MM-DD HH:mm:ss') {
  if (!date) return null
  try {
    return dayjs(date).format(format)
  } catch (e) {
    return null
  }
}
