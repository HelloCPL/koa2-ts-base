/**
 * @description: 全局声明
 * @author chen
 * @update 2021-01-19 15:54:01
*/

interface ToolsOptions {
  toPath: Function,
  sureIsArray: Function,
  getTerminal: Function,
  getUserAgent: Function,
  toCamelCase: Function,
  isObject: Function,
  getUuId: Function,
  getFileName: Function,
  [x: string]: any
}

interface DatabaseOption {
  NAME: string,
  USER: string,
  PASSWORD: string,
  HOST: string,
  PORT: number,
  CONNECTION_LIMIT: number
}

interface RedisOption {
  HOST: string,
  PORT: number,
  PASSWORD: string
}

interface WXOption {
  APP_ID: string,
  APP_SECRET: string,
  LOGIN_URL: string,
}

interface ConfigOption {
  ENV: string,
  PORT: number,
  HTTPS_PORT: number,
  ALLOW_MULTIPLE: boolean,
  VERIFY_CHECK_FILE: boolean,
  CRYPTOJS_KEY: string,
  CRYPTOJS_IV: string,
  DATABASE: DatabaseOption,
  REDIS: RedisOption,
  SECRET_KEY: string,
  EXPIRES_IN: number,
  DELAY: number,
  WX: WXOption,
  BASE_URL: string,
  [x: string]: any
}

interface MessageOption {
  error: string,
  parameter: string,
  notFound: string,
  forbidden: string,
  authFailed: string,
  rules: string,
  success: string,
  [x: string]: any
}

interface CodeOption {
  error: number,
  parameter: number,
  notFound: number,
  forbidden: number,
  authFailed: number,
  success: number,
  authLogin: number,
  authRefresh: number,
  [x: string]: any
}

interface ParamsMessageOption {
  isLength: string,
  isString: string,
  isBoolean: string,
  isInt: string,
  isFloat: string,
  isEmail: string,
  [x:string]: any
}

// 声明命名空间 合并 Global 接口，用于扩展global对象
declare namespace NodeJS {
  interface Global {
    _: any,
    dayjs: any,
    tools: ToolsOptions,
    CONFIG: ConfigOption,
    Message: MessageOption,
    Code: CodeOption,
    ParamsMessage: ParamsMessageOption,
    ExceptionHttp: any,
    ExceptionParameter: any,
    ExceptionNotFound: any,
    ExceptionForbidden: any,
    ExceptionAuthFailed: any,
    Success: any,
    requestCount: number,
    requestStart: any,
    requestEnd: any,
  }
}
