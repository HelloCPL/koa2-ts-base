/**
 * @description: 设置全局 变量或方法
 * @author chen
 * @update 2021-01-19 15:06:23
*/

import _ from 'lodash'
import dayjs from 'dayjs'
import tools from '../utils/tools'
import CONFIG from '../config'
import { Message, Code, ParamsMessage } from './enums'
import { ExceptionHttp, ExceptionParameter, ExceptionNotFound, ExceptionForbidden, ExceptionAuthFailed, Success } from '../utils/http-exception'


class InitGlobal {
  constructor() { }

  init() {
    global._ = _ // lodash
    global.dayjs = dayjs // 时间处理方法
    global.tools = tools // 常用方法集合
    global.CONFIG = CONFIG // 配置
    global.Message = Message // 返回提示信息
    global.Code = Code // 返回状态吗
    global.ParamsMessage = ParamsMessage // 参数提示信息
    global.ExceptionHttp = ExceptionHttp // 普通系统异常
    global.ExceptionParameter = ExceptionParameter // 参数异常
    global.ExceptionNotFound = ExceptionNotFound // 404 异常
    global.ExceptionForbidden = ExceptionForbidden // 权限不足异常
    global.ExceptionAuthFailed = ExceptionAuthFailed // 授权失败异常
    global.Success = Success // 成功异常类
    global.requestCount = 0
    global.requestStart = process.hrtime.bigint()
    global.requestEnd = process.hrtime.bigint()
  }
}

export default new InitGlobal()