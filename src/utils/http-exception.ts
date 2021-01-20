/**
 * @description: 设置异常类
 * @author chen
 * @update 2021-01-20 10:24:21
*/

// / <reference path="../enumeration/index.ts" />

export class ExceptionHttp extends Error {
  message: string
  data: any
  code: number
  total: number
  constructor(message?: string, data?: any, code?: number, total?: number) {
    super()
    this.message = message || global.Message.error
    this.data = data || null
    this.code = code || global.Code.error
    this.total = total || 0
  }
}

export class ExceptionParameter extends ExceptionHttp {
  constructor(message?: string, data?: any, code?: number, total?: number) {
    super()
    this.message = message || global.Message.parameter
    this.data = data || null
    this.code = code || global.Code.parameter
    this.total = total || 0
  }
}

export class ExceptionNotFound extends ExceptionHttp {
  constructor(message?: string, data?: any, code?: number, total?: number) {
    super()
    this.message = message || global.Message.notFound
    this.data = data || null
    this.code = code || global.Code.notFound
    this.total = total || 0
  }
}

export class ExceptionForbidden extends ExceptionHttp {
  constructor(message?: string, data?: any, code?: number, total?: number) {
    super()
    this.message = message || global.Message.forbidden
    this.data = data || null
    this.code = code || global.Code.forbidden
    this.total = total || 0
  }
}

export class ExceptionAuthFailed extends ExceptionHttp {
  constructor(message?: string, data?: any, code?: number, total?: number) {
    super()
    this.message = message || global.Message.authFailed
    this.data = data || null
    this.code = code || global.Code.authFailed
    this.total = total || 0
  }
}

export class Success extends ExceptionHttp {
  constructor(message?: string, data?: any, code?: number, total?: number) {
    super()
    this.message = message || global.Message.success
    this.data = data || null
    this.code = code || global.Code.success
    this.total = total || 0
  }
}

















