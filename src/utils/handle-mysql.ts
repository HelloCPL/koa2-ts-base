/**
 * @description 处理 mysql 设置参数或查询参数
 * @author chen
 * @update 2021-06-20 16:30:28
 * @list 方法集合说明
 *   updateSet // 处理编辑更新的数据SQL语句
 *   selectWhere // 处理查询列表时where条件语句
 *   selectWhereKeyword // 处理查询列表时where条件为keyword时
 *   selectWhereByTime // 处理查询列表时where条件为时间区域时
*/

import _ from 'lodash'
import { formatDate } from './tools'

interface returnOptions {
  sql: string,
  data: any[]
}

/**
 * 处理编辑更新的数据SQL语句
 * valid 有效的参数名集合 可带表名、指定数据key，如 pas t1.pas pas:password
 * data 传参对象
*/
export const updateSet = (params: paramsOptions): returnOptions => {
  let sql = ''
  let data: any[] = []
  params.valid.forEach((value) => {
    let keys = _findKeys(value)
    if (params.data.hasOwnProperty(keys.camelCaseKey)) {
      if (data.length === 0) sql += ` \`${keys.snakeCaseKey}\` = ? `
      else sql += ` , \`${keys.snakeCaseKey}\` = ? `
      data.push(params.data[keys.camelCaseKey])
    }
  })
  return { sql, data }
}

/**
 * 处理查询列表时where条件语句
 * valid 有效的参数名集合 可带表名、指定数据key，如 pas t1.pas pas:password
 * data 传参对象
 * prefix SQL条件前缀 默认 AND
 * connector SQL条件连接符 默认 AND
*/
interface paramsOptions {
  valid: string[],
  data: ObjectAny,
  prefix?: String,
  connector?: String
}
export const selectWhere = (params: paramsOptions): returnOptions => {
  params.prefix = params.prefix || 'AND'
  params.connector = params.connector || 'AND'
  let sql = ''
  let data: any[] = []
  params.valid.forEach((value) => {
    let keys = _findKeys(value)
    let flag = params.data.hasOwnProperty(keys.camelCaseKey) && (params.data[keys.camelCaseKey] || params.data[keys.camelCaseKey] === 0 || params.data[keys.camelCaseKey] === false)
    if (flag) {
      if (data.length === 0) sql += ` \`${keys.snakeCaseKey}\` = ? `
      else sql += ` ${params.connector} \`${keys.snakeCaseKey}\` = ? `
      data.push(params.data[keys.camelCaseKey])
    }
  })
  if (sql)
    sql = ` ${params.prefix} ${sql}`
  return { sql, data }
}

/**
 * 处理查询列表时where条件为keyword时
 * valid 有效的参数名集合 可带表名、指定数据key，如 pas t1.pas pas:password
 * data 传参对象
 * prefix SQL条件前缀 默认 AND
 * connector SQL条件连接符 默认 OR
*/
interface paramsKeywordOptions {
  valid: string[],
  keyword: any,
  prefix?: String,
  connector?: String
}
export const selectWhereKeyword = (params: paramsKeywordOptions): returnOptions => {
  params.prefix = params.prefix || 'AND'
  params.connector = params.connector || 'OR'
  let sql = ''
  let data: any[] = []
  params.valid.forEach((value) => {
    let keys = _findKeys(value)
    let flag = params.keyword || params.keyword === 0 || params.keyword === false
    if (flag) {
      if (!sql) sql += ` \`${keys.snakeCaseKey}\` LIKE ? `
      else sql += ` ${params.connector} \`${keys.snakeCaseKey}\` LIKE ? `
      data.push(`%${params.keyword}%`)
    }
  })
  if (sql) sql = ` ${params.prefix} (${sql})`
  return { sql, data }
}

/**
 * 处理查询列表时where条件为时间区域时
 * startTime 开始时间数据
 * endTime 结束时间数据
 * sqlTime 对比字段名 默认 update_time 如 update_time t1.update_time
 * prefix SQL条件前缀 默认 AND
*/
export const selectWhereByTime = (startTime: any, endTime: any, sqlTime = 'update_time', prefix = 'AND'): returnOptions => {
  let sql = ''
  let data: any[] = []
  startTime = formatDate(startTime)
  if (startTime) {
    sql += ` \`${startTime}\` < ${sqlTime} `
    data.push(startTime)
  }
  endTime = formatDate(endTime)
  if (endTime) {
    if (!sql) sql += ` \`${endTime}\` < ${sqlTime} `
    else sql += ` AND \`${endTime}\` > ${sqlTime} `
    data.push(endTime)
  }
  if (sql) sql = ` ${prefix} ${sql} `
  return { sql, data }
}

interface returnKeyOptions {
  camelCaseKey: string,
  snakeCaseKey: string
}
// 获取SQL的key和data的key
function _findKeys(str: string,): returnKeyOptions {
  let camelCaseKey = str
  let snakeCaseKey = str
  let i1 = str.indexOf(':')
  if (i1 !== -1) {
    camelCaseKey = snakeCaseKey.substring(i1 + 1)
    snakeCaseKey = snakeCaseKey.substring(0, i1)
  }
  let i2 = str.indexOf('.')
  if (i2 !== -1) {
    camelCaseKey = snakeCaseKey.substring(i2 + 1)
    snakeCaseKey = snakeCaseKey.substring(0, i2) + '.' + _.snakeCase(snakeCaseKey.substring(i2 + 1))
  } else {
    snakeCaseKey = _.snakeCase(snakeCaseKey)
  }
  return {
    camelCaseKey: _.camelCase(camelCaseKey),
    snakeCaseKey
  }
}