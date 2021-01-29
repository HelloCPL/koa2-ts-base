/**
 * @description: 连接 redis 保存 token
 * @author chen
 * @update 2021-01-29 11:24:45
*/

// import session from 'koa-generic-session'
import KoaRedis from 'koa-redis'

const redisClient = KoaRedis(
  {
    host: 'localhost',
    db: 1
  }
).client

redisClient.on('connect', (err:any) => {
  console.log('redis 正在连接...');
  console.log('');
})

redisClient.on('error', (err: any) => {
  console.log(err);
  throw new global.ExceptionHttp({
    message: 'redis 连接发生错误'
  })
})

export default redisClient
