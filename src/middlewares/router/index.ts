/**
 * @description 路由注册装饰器 方法集合
 * 装饰器权重 Required > Get Post Put Delete > Convert
 * @author chen
 * @update 2021-01-22 14:48:09
*/

import Koa from 'koa'
import { symbolRoutePrefix, Route } from './Route';
import { ValidatorParameters } from '../../utils/validator'
import { LinValidator } from '../../lib/lin-validator'
import _ from 'lodash'
import Logger from '../../utils/logs'

// 记录总数
export let requestCount: number = 0

/**
 * @author chen
 * @params prefix 路由前缀
 * @description 用于追加路由前缀 类装饰器
 * @update 2021-01-22 16:25:57
*/
export function Prefix(prefix: string) {
  return (target: any) => {
    target.prototype[symbolRoutePrefix] = prefix
  }
}

/**
 * @author chen
 * @params path 路由路径 unless 是否拦截 terminals 支持的终端，包括 ['management','pc','wechat','mobile', 'app']
 * @description 处理 get 请求 方法装饰器
 * @update 2021-01-22 17:20:23
*/
export function Get(path: string, unless?: boolean, terminals?: string[]) {
  return (target: any, name: string, descriptor: PropertyDescriptor) => {
    let config = {
      method: 'get',
      path,
      unless,
      terminals
    }
    return router(target, name, descriptor, config)
  }
}

/**
 * @author chen
 * @params path 路由路径 unless 是否拦截 terminals 支持的终端，包括 ['management','pc','wechat','mobile', 'app']
 * @description 处理 post 请求 方法装饰器
 * @update 2021-01-22 17:20:23
*/
export function Post(path: string, unless?: boolean, terminals?: string[]) {
  return (target: any, name: string, descriptor: PropertyDescriptor) => {
    let config = {
      method: 'post',
      path,
      unless,
      terminals
    }
    return router(target, name, descriptor, config)
  }
}

/**
 * @author chen
 * @params path 路由路径 unless 是否拦截 terminals 支持的终端，包括 ['management','pc','wechat','mobile', 'app']
 * @description 处理 put 请求 方法装饰器
 * @update 2021-01-22 17:20:23
*/
export function Put(path: string, unless?: boolean, terminals?: string[]) {
  return (target: any, name: string, descriptor: PropertyDescriptor) => {
    let config = {
      method: 'put',
      path,
      unless,
      terminals
    }
    return router(target, name, descriptor, config)
  }
}

/**
 * @author chen
 * @params path 路由路径 unless 是否拦截 terminals 支持的终端，包括 ['management','pc','wechat','mobile', 'app']
 * @description 处理 put 请求 方法装饰器
 * @update 2021-01-22 17:20:23
*/
export function Delete(path: string, unless?: boolean, terminals?: string[]) {
  return (target: any, name: string, descriptor: PropertyDescriptor) => {
    let config = {
      method: 'delete',
      path,
      unless,
      terminals
    }
    return router(target, name, descriptor, config)
  }
}

/**
 * @author chen
 * @params path 路由路径 unless 是否拦截 terminals 支持的终端，包括 ['management','pc','wechat','mobile', 'app']
 * @description: 处理 all 请求 方法装饰器
 * @update 2021-02-08 12:02:13
*/
export function All(path: string, unless?: boolean, terminals?: string[]) {
  return (target: any, name: string, descriptor: PropertyDescriptor) => {
    let config = {
      method: 'all',
      path,
      unless,
      terminals
    }
    return router(target, name, descriptor, config)
  }
}

/**
 * @author chen
 * @params params 必传参数列表，如需指定类型，用 &+类型 拼接成字符串
 * 如 @Required(['id', 'age&isInt', 'type&isBoolean'])
 * @description 校验必传参数 包含 params query path header 后面可通过 ctx.data[类型].XXX 获取参数 方法装饰器
 * 如 let age = ctx.data.query.age
 * @update 2021-01-23 10:53:21
*/
export function Required(params: any[] = []) {
  return function (target: any, name: string, descriptor: PropertyDescriptor) {
    target[name] = global.tools.sureIsArray(target[name])
    target[name].splice(0, 0, middleware)
    return descriptor
    // 处理参数中间件
    async function middleware(ctx: Koa.Context, next: any) {
      let newParams = ValidatorRequiredParams(params)
      await new ValidatorParameters(newParams).validate(ctx)
      await next()
    }
  }
}

/**
 * @author chen
 * @params middleware 中间件方法 
 * @description 添加中间件处理方法 @convert(async function(ctx, next){await next()}) 方法装饰器
 * @update 2021-01-23 15:09:34
*/
export function Convert(middleware: any) {
  return function (target: any, name: string, descriptor: any) {
    target[name] = global.tools.sureIsArray(target[name])
    target[name].splice(target[name].length - 1, 0, middleware)
    return descriptor
  }
  // return decorate(function (target: any, name: string, descriptor: any, middleware: Function) {
  //   target[name] = global.tools.sureIsArray(target[name])
  //   target[name].splice(target[name].length - 1, 0, middleware)
  //   return descriptor
  // }, global.tools.sureIsArray(middleware))
}

/**
 * 统一路由请求处理方法
*/
function router(target: any, name: string, descriptor: PropertyDescriptor, config: ObjectRequired) {
  if (!(_.isArray(config.terminals) && config.terminals?.length))
    config.terminals = ['management', 'pc', 'wechat', 'mobile', 'app']
  Route.__DecoratedRouters.set({
    target: target,
    path: config.path,
    method: config.method,
    unless: config.unless,
    terminals: config.terminals
  }, target[name])
  target[name] = global.tools.sureIsArray(target[name])
  // target[name].splice(target[name].length - 1, 0, middleware)
  let i = target[name].length - 1 >= 1 ? 1 : 0
  target[name].splice(i, 0, middleware)
  // target[name.splice(target[name].length - 1, 0, middleware)]
  return descriptor
  // 挂载参数数据并记录打印日志
  async function middleware(ctx: Koa.Context, next: any) {
    const v = await new LinValidator().validate(ctx)
    ctx.data = v.data
    // 记录日志
    global.requestCount++
    global.requestStart = process.hrtime.bigint()
    let userId = null
    if (ctx.user) userId = ctx.user.id
    Logger.request(ctx)
    await next()
  }
}

/**
 * 处理校验参数
*/
function ValidatorRequiredParams(params: any[]) {
  return params.map((item: string) => {
    let i = item.indexOf('&'),
      key: string,
      rule: string
    if (i !== -1) {
      key = item.substring(0, i)
      rule = item.substring(i + 1)
    } else {
      key = item
      rule = 'isLength'
    }
    return {
      key,
      rules: [rule, global.ParamsMessage[rule] || '参数格式错误']
    }
  })
}

/**
 * 执行处理调用中间件方法
*/
// function decorate(handleDescriptor: Function, entryArgs: Array<Function>) {
//   // @ts-ignore
//   if (isDescriptor(_.last(entryArgs))) return handleDescriptor(entryArgs)
//   else return handleDescriptor(...arguments, ...entryArgs)
// }

/**
 * 是否被修饰的对象原来值
 */
// function isDescriptor(desc: PropertyDescriptor) {
//   if (!desc || !desc.hasOwnProperty) return false;
//   for (let key of ['value', 'initializer', 'get', 'set']) {
//     if (desc.hasOwnProperty(key)) return true;
//   }
//   return false;
// }
