/**
 * @description: 全局配置
 * @author chen
 * @update 2021-01-19 16:11:18
*/

const ENV = process.argv[2]

interface ConfigOption {
  ENV: string,
  PORT: number,
  HTTPS_PORT: number,
  CRYPTOJS_KEY: string,
  CRYPTOJS_IV: string,
  DATABASE: DatabaseOption,
  REDIS: RedisOption,
  PC: SecretOption,
  MANAGEMENT: SecretOption,
  MOBILE: SecretOption,
  APP: SecretOption,
  WECHAT: SecretOption,
  WX: WXOption,
  BASE_URL: string,
  [x: string]: any
}

const InitConfig = () => {
  switch (ENV) {
    // 正式环境
    case 'prod':
      return {
        ENV: 'prod',
        PORT: 3000,
        HTTPS_PORT: 443,
        CRYPTOJS_KEY: 'thisisacryptojskey63', // crypto-js 加密字符
        CRYPTOJS_IV: 'thisisacryptojsiv63', // crypto-js 加密字符
        DATABASE: { // 数据库配置
          NAME: 'introduce',
          USER: 'root',
          PASSWORD: 'CPLabc603.',
          HOST: '106.55.153.80',
          PORT: 3306,
          CONNECTION_LIMIT: 500
        },
        REDIS: { // 配置redis
          HOST: '106.55.153.80',
          PORT: 6379,
          PASSWORD: '123456',
        },
        MANAGEMENT: { // 管理端 代号 1
          SECRET_KEY: 'MANAGEMENT', // token 秘钥
          EXPIRES_IN: 60 * 60 * 24, // token 有效时间默认 24小时
          DELAY: 60 * 60 * 2, // token 过期后在 2小时 内可刷新
          ALLOW_MULTIPLE: true, // 是否允许同一账号同时登陆多个设备
        },
        PC: { // PC电脑端 代号 2
          SECRET_KEY: 'PC', // token 秘钥
          EXPIRES_IN: 60 * 60 * 24, // token 有效时间默认 24小时
          DELAY: 60 * 60 * 2, // token 过期后在 2小时 内可刷新
          ALLOW_MULTIPLE: true, // 是否允许同一账号同时登陆多个设备
        },
        MOBILE: { // 移动端 代号 3
          SECRET_KEY: 'MOBILE', // token 秘钥
          EXPIRES_IN: 60 * 60 * 24, // token 有效时间默认 24小时
          DELAY: 60 * 60 * 2, // token 过期后在 2小时 内可刷新
          ALLOW_MULTIPLE: true, // 是否允许同一账号同时登陆多个设备
        },
        WECHAT: { // 小程序端 代号 4
          SECRET_KEY: 'WECHAT', // token 秘钥
          EXPIRES_IN: 60 * 60 * 24 * 10, // token 有效时间默认 24小时
          DELAY: 60 * 60 * 24 * 3, // token 过期后在 2小时 内可刷新
          ALLOW_MULTIPLE: true, // 是否允许同一账号同时登陆多个设备
        },
        APP: { // app端 代号 5
          SECRET_KEY: 'APP', // token 秘钥
          EXPIRES_IN: 60 * 60 * 24, // token 有效时间默认 24小时
          DELAY: 60 * 60 * 2, // token 过期后在 2小时 内可刷新
          ALLOW_MULTIPLE: true, // 是否允许同一账号同时登陆多个设备
        },
        WX: { // 微信小程序信息配置
          APP_ID: 'wxbeb5ada6bf1d27ef',
          APP_SECRET: 'b11e05c65f0e9db81695f827b49edcb8',
        },
        BASE_URL: 'http://106.55.153.80:3000/', // 默认路径
      }

    // 测试环境
    default:
      return {
        ENV: 'dev',
        PORT: 3000,
        HTTPS_PORT: 443,
        CRYPTOJS_KEY: 'thisisacryptojskey63', // crypto-js 加密字符
        CRYPTOJS_IV: 'thisisacryptojsiv63', // crypto-js 加密字符
        DATABASE: { // 数据库配置
          // NAME: 'introduce-test',
          NAME: 'introduce_test',
          USER: 'root',
          PASSWORD: 'CPLabc603.',
          HOST: '106.55.153.80',
          PORT: 3306,
          CONNECTION_LIMIT: 500
        },
        REDIS: { // 配置redis
          HOST: '106.55.153.80',
          PORT: 6379,
          PASSWORD: '123456',
        },
        MANAGEMENT: { // 管理端 代号 1
          SECRET_KEY: 'MANAGEMENT', // token 秘钥
          EXPIRES_IN: 60 * 60 * 24, // token 有效时间默认 24小时
          DELAY: 60 * 60 * 2, // token 过期后在 2小时 内可刷新
          ALLOW_MULTIPLE: true, // 是否允许同一账号同时登陆多个设备
        },
        PC: { // PC电脑端 代号 2
          SECRET_KEY: 'PC', // token 秘钥
          EXPIRES_IN: 60 * 60 * 24, // token 有效时间默认 24小时
          DELAY: 60 * 60 * 2, // token 过期后在 2小时 内可刷新
          ALLOW_MULTIPLE: true, // 是否允许同一账号同时登陆多个设备
        },
        MOBILE: { // 移动端 代号 3
          SECRET_KEY: 'MOBILE', // token 秘钥
          EXPIRES_IN: 60 * 60 * 24, // token 有效时间默认 24小时
          DELAY: 60 * 60 * 2, // token 过期后在 2小时 内可刷新
          ALLOW_MULTIPLE: true, // 是否允许同一账号同时登陆多个设备
        },
        WECHAT: { // 小程序端 代号 4
          SECRET_KEY: 'WECHAT', // token 秘钥
          EXPIRES_IN: 60 * 60 * 24 * 10, // token 有效时间默认 24小时
          DELAY: 60 * 60 * 24 * 3, // token 过期后在 2小时 内可刷新
          ALLOW_MULTIPLE: true, // 是否允许同一账号同时登陆多个设备
        },
        APP: { // app端 代号 5
          SECRET_KEY: 'APP', // token 秘钥
          EXPIRES_IN: 60 * 60 * 24, // token 有效时间默认 24小时
          DELAY: 60 * 60 * 2, // token 过期后在 2小时 内可刷新
          ALLOW_MULTIPLE: true, // 是否允许同一账号同时登陆多个设备
        },
        WX: { // 微信小程序信息配置
          APP_ID: 'wxbeb5ada6bf1d27ef',
          APP_SECRET: 'b11e05c65f0e9db81695f827b49edcb8',
        },
        BASE_URL: 'http://localhost:3000/', // 默认路径
      }
  }
}

const CONFIG: ConfigOption = InitConfig()
export default CONFIG