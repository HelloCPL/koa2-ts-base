/**
 * @description: 设置异常类
 * @author chen
 * @update 2021-01-20 10:24:21
*/

export class ExceptionHttp extends Error {
  message: string
  data: any
  code: number
  total: number
  constructor(config: ObjectException = {}) {
    super()
    this.message = config.message || global.Message.error
    this.data = config.data || null
    this.code = config.code || global.Code.error
    this.total = config.total || 0
    this.formatDataKey()
  }

  // 格式化返回数据 若为对象，属性名统一转成驼峰命名
  formatDataKey() {
    this.data = global.tools.toCamelCase(this.data)
  }
}

export class ExceptionParameter extends ExceptionHttp {
  constructor(config: ObjectException = {}) {
    super()
    this.message = config.message || global.Message.parameter
    this.data = config.data || null
    this.code = config.code || global.Code.parameter
    this.total = config.total || 0
    this.formatDataKey()
  }
}

export class ExceptionNotFound extends ExceptionHttp {
  constructor(config: ObjectException = {}) {
    super()
    this.message = config.message || global.Message.notFound
    this.data = config.data || null
    this.code = config.code || global.Code.notFound
    this.total = config.total || 0
    this.formatDataKey()
  }
}

export class ExceptionForbidden extends ExceptionHttp {
  constructor(config: ObjectException = {}) {
    super()
    this.message = config.message || global.Message.forbidden
    this.data = config.data || null
    this.code = config.code || global.Code.forbidden
    this.total = config.total || 0
    this.formatDataKey()
  }
}

export class ExceptionAuthFailed extends ExceptionHttp {
  constructor(config: ObjectException = {}) {
    super()
    this.message = config.message || global.Message.authFailed
    this.data = config.data || null
    this.code = config.code || global.Code.authFailed
    this.total = config.total || 0
    this.formatDataKey()
  }
}

export class Success extends ExceptionHttp {
  constructor(config: ObjectException = {}) {
    super()
    this.message = config.message || global.Message.success
    this.data = config.data || null
    this.code = config.code || global.Code.success
    this.total = config.total || 0
    this.formatDataKey()
  }
}

















