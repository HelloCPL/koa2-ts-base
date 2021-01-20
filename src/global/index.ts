/**
 * @description: 设置全局 变量或方法
 * @author chen
 * @update 2021-01-19 15:06:23
*/

import _ from 'lodash'
import CONFIG from '../config'
import { Message, Code } from '../enumeration'
import { ExceptionHttp, ExceptionParameter, ExceptionNotFound, ExceptionForbidden, ExceptionAuthFailed, Success } from '../utils/http-exception'

class InitGlobal {
  constructor() { }

  init() {
    global._ = _
    global.CONFIG = CONFIG
    global.Message = Message
    global.Code = Code
    global.ExceptionHttp = ExceptionHttp
    global.ExceptionParameter = ExceptionParameter
    global.ExceptionNotFound = ExceptionNotFound
    global.ExceptionForbidden = ExceptionForbidden
    global.ExceptionAuthFailed = ExceptionAuthFailed
    global.Success = Success

  }
}

export default new InitGlobal()