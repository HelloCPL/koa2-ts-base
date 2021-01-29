/**
 * @description: 自定义声明
 * @author chen
 * @update 2021-01-27 15:26:09
*/

// 任意对象类型
interface ObjectAny {
  [x: string]: any
}

// 错误类接口类型
interface ObjectException {
  message?: string,
  data?: any,
  code?: number,
  total?: number
}

// 数据库查询参数接口类型
interface ObjectSQLParams {
  sql: string,
  data?: string
}

// 路由请求参数接口类型
interface ObjectRequired {
  method: string,
  path: string,
  unless?: boolean,
  terminals?: string[]
}

// 自动注册路由传参接口类型
interface ObjectRoute {
  target: any,
  method: string,
  path: string,
  unless?: boolean,
  terminals: string[]
}

// 任意数组类型
interface ArrayAny {
  [index: number]: any,
  length: number
}








