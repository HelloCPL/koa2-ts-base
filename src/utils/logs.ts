/**
 * @description: 日志工具方法
 * @author chen
 * @update 2021-03-11 17:33:29
*/

// https://www.cnblogs.com/chunshan-blog/p/12632141.html

const ENV = process.argv[2]

import log4js from 'log4js'
import logsConfig from '../config/logs'
import _ from 'lodash'

interface LoggerOptions {
  request: Function,
  response: Function,
  query: Function,
  error: Function,
  [x: string]: any
}

// 加载配置文件
log4js.configure(logsConfig)

// 调用预先定义的日志名称
let infoLogger = log4js.getLogger('infoLogger')
let errorLogger = log4js.getLogger('errorLogger')

// 格式化日志文本
let formatText = {
  // 普通请求日志
  request: function (ctx: any) {
    global.requestStart = process.hrtime.bigint()
    let logText: string = ''
    logText += `\n==================== 接口请求开始 ${global.requestCount} ====================`
    logText += `\n[请求日志信息开始]`
    logText += `\n  [requestStartTime]: ${global.requestStart},`
    logText += `\n  [requestOriginalUrl]: ${ctx.originalUrl},`
    logText += `\n  [requestIP]: ${ctx.ip},`
    if (ctx.user && ctx.user.id)
      logText += `\n  [requestUserInfo]: ${JSON.stringify(ctx.user)},`
    logText += `\n  [requestAPI]: ${ctx.url},`
    logText += `\n  [requestMethod]: ${ctx.method},`
    logText += `\n  [requestParameters]: ${JSON.stringify(ctx.data)}`
    logText += `\n[请求日志信息结束]\n`
    if (ENV === 'dev') console.log(logText);
    return logText
  },

  // 响应
  response: function (ctx: any, data?: any) {
    global.requestEnd = process.hrtime.bigint()
    let costTime = global.requestEnd - global.requestStart
    let logText = ''
    logText += `\n[响应日志信息开始]`
    logText += `\n  [responseEndTime]: ${global.requestEnd}`
    logText += `\n  [responseTotalTime]: ${Number(costTime) / 1e6}毫秒`
    logText += `\n  [responseData]: ${JSON.stringify(data)}`
    logText += `\n[响应日志信息结束]`
    logText += `\n******************** 接口响应结束 ${global.requestCount} ********************\n`
    if (ENV === 'dev') console.log(logText);
    return logText;
  },

  // 数据库查询
  query: function (sql: any, data?: any) {
    let logText = ''
    if (data && _.isArray(data))
      data = JSON.stringify(data)
    logText += `\n[查询数据库日志信息开始]`
    logText += `\n  [SQL]: ${sql}`
    logText += `\n  [SQLData]: ${data}`
    logText += `\n[查询数据库日志信息结束]\n`
    if (ENV === 'dev') console.log(logText);
    return logText;
  },

  // 错误日志
  error: function (...arg: any) {
    let logText = ''
    logText += `\n!!!!!!!!!!!!!!!!!!!! 错误日志信息开始 ${global.requestCount} !!!!!!!!!!!!!!!!!!!!`
    for (let i = 0, len = arg.length; i < len; i++) {
      let info = arg[i]
      if (_.isObject(info)) info = JSON.stringify(info)
      logText += `\n  [errorInfoLog]: ${info}`
    }
    logText += `\n!!!!!!!!!!!!!!!!!!!! 错误日志信息结束 ${global.requestCount} !!!!!!!!!!!!!!!!!!!!\n`
    console.log(logText);
    return logText;
  },
}

const Logger: LoggerOptions = {
  // 打印请求信息
  request: function (ctx: any) {
    if (ctx.request.url.startsWith('/favicon')) return
    infoLogger.info(formatText.request(ctx))
  },

  // 打印响应信息
  response: function (ctx: any, data?: any) {
    if (ctx.request.url.startsWith('/favicon')) return
    infoLogger.info(formatText.response(ctx, data))
  },

  // 打印数据库查询信息
  query: function (sql: any, data?: any) {
    infoLogger.info(formatText.query(sql, data))
  },

  // 打印数据库查询信息
  error: function (...arg: any) {
    infoLogger.info(formatText.error(...arg))
  },
}
export default Logger
