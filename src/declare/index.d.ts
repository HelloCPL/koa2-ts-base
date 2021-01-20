/**
 * @description: 全局声明
 * @author chen
 * @update 2021-01-19 15:54:01
*/

interface DatabaseOption {
  NAME: string,
  USER: string,
  PASSWORD: string,
  HOST: string,
  PORT: number,
  CONNECTION_LIMIT: number
}

interface SecurityOption {
  SECRET_KEY: string,
  expiresIn: number
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
  DATABASE: DatabaseOption,
  SECURITY_PC: SecurityOption,
  SECURITY_MOBILE: SecurityOption,
  SECURITY_WECHAT: SecurityOption,
  SECURITY_APP: SecurityOption,
  WX: WXOption,
  BASE_URL: string,
  FILE_URL: string,
  IMAGE_URL: string,
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
  [x: string]: any
}

// 声明命名空间 合并 Global 接口，用于扩展global对象
declare namespace NodeJS {
  interface Global {
    _: any,
    CONFIG: ConfigOption,
    Message: MessageOption,
    Code: CodeOption,
    ExceptionHttp: any,
    ExceptionParameter: any,
    ExceptionNotFound: any,
    ExceptionForbidden: any,
    ExceptionAuthFailed: any,
    Success: any
  }

}

