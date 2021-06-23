/**
 * @description 处理 mysql 设置参数或查询参数
 * @author chen
 * @update 2021-06-20 16:30:28
 * @list 方法集合说明
 *   updateSet // 处理编辑更新的数据SQL语句
 *   selectWhere // 处理查询列表时where条件语句
*/

import _ from 'lodash'

// 'UPDATE users_info SET user_name = ?, sex = ?, birthday = ?, address = ?, professional = ?, remarks = ?, update_time = ? WHERE id = ?;'

// `SELECT * FROM users_info WHERE id = ?`

interface paramsOptions {
  valid: string[],
  data: ObjectAny
}

interface paramsKeywordOptions {
  valid: string[],
  keyword: any
}

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
*/
export const selectWhere = (params: paramsOptions, prefix: string = 'AND'): returnOptions => {
  let sql = ''
  let data: any[] = []
  params.valid.forEach((value) => {
    let keys = _findKeys(value)
    let flag = params.data.hasOwnProperty(keys.camelCaseKey) && (params.data[keys.camelCaseKey] || params.data[keys.camelCaseKey] === 0 || params.data[keys.camelCaseKey] === false)
    if (flag) {
      if (data.length === 0) sql += ` \`${keys.snakeCaseKey}\` = ? `
      else sql += ` ${prefix} \`${keys.snakeCaseKey}\` = ? `
      data.push(params.data[keys.camelCaseKey])
    }
  })
  return { sql, data }
}

/**
 * 处理查询列表时where条件为keyword时
 * valid 有效的参数名集合 可带表名、指定数据key，如 pas t1.pas pas:password
 * data 传参对象
*/
export const selectWhereKeyword = (params: paramsKeywordOptions, prefix: string = 'OR'): returnOptions => {
  let sql = ''
  let data: any[] = []
  params.valid.forEach((value) => {
    let keys = _findKeys(value)
    let flag = params.keyword || params.keyword === 0 || params.keyword === false
    if (flag) {
      if (!sql) sql += ` \`${keys.snakeCaseKey}\` LIKE ? `
      else sql += ` ${prefix} \`${keys.snakeCaseKey}\` LIKE ? `
      data.push(`%${params.keyword}%`)
    }
  })
  if(sql) sql = `(${sql})`
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