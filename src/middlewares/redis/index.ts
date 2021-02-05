/**
 * @description: 连接 redis 保存 token
 * @author chen
 * @update 2021-01-29 11:24:45
*/

import Redis from 'redis'
import CONFIG from '../../config'

// 创建 redis 连接
const redisClient = Redis.createClient(CONFIG.REDIS.PORT, CONFIG.REDIS.HOST)

// 登录
redisClient.auth(CONFIG.REDIS.PASSWORD, () => {
  console.log('redis 登录成功');
})

// 监听 redis 错误事件
redisClient.on('error', err => {
  console.log('----------- redis 发生错误 start -----------');
  console.log(err);
  console.log('----------- redis 发生错误 end -----------');
})

// 保存 redis 值
export const clientSet = (key: string, value: any) => {
  if(!key) return 
  return new Promise((resolve, reject) => {
    let newValue = handleValueToString(value)
    redisClient.set(key, newValue, (err: any) => {
      if (err) reject(err)
      else resolve(null)
    })
  })
}

// 获取 redis 值
export const clientGet = (key: string) => {
  if(!key) return 
  return new Promise((resolve, reject) => {
    redisClient.get(key, (err: any, value) => {
      if (err) reject(err)
      else resolve(handleValueToParse(value))
    })
  })
}

// 删除 redis 值
export const clientDel = (key: string) => {
  if(!key) return 
  return new Promise((resolve, reject) => {
    redisClient.del(key, (err: any) => {
      if (err) reject(err)
      else resolve(null)
    })
  })
}

// 处理数据 JSON 格式字符串
function handleValueToString(val: any) {
  if (global._.isArray(val) || global._.isPlainObject(val))
    return JSON.stringify(val)
  return val.toString()
}

// 格式化 字符串
function handleValueToParse(val: any) {
  try {
    return JSON.parse(val)
  } catch (e) {
    return val
  }
}
