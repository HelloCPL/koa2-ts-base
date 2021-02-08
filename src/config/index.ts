/**
 * @description: 全局配置
 * @author chen
 * @update 2021-01-19 16:11:18
*/

const ENV = process.argv[2]

const InitConfig = () => {
  switch (ENV) {
    // 正式环境
    case 'prod':
      return {
        ENV: 'prod',
        PORT: 3000,
        HTTPS_PORT: 443,
        ALLOW_MULTIPLE: true, // 是否允许同一账号同时登陆多个设备
        VERIFY_CHECK_FILE: true, // 是否对文件查看进行权限判断
        CRYPTOJS_KEY: 'thisisacryptojskey63', // crypto-js 加密字符
        CRYPTOJS_IV: 'thisisacryptojsiv63', // crypto-js 加密字符
        DATABASE: { // 数据库配置
          NAME: 'introduce',
          USER: 'root',
          PASSWORD: 'CPLabc603',
          HOST: '106.55.153.80',
          PORT: 3306,
          CONNECTION_LIMIT: 500
        },
        REDIS: { // 配置redis
          HOST: '106.55.153.80',
          PORT: 6379,
          PASSWORD: '123456',
        },
        SECRET_KEY: 'PC', // token 秘钥
        EXPIRES_IN: 60 * 60 * 24, // token 有效时间默认 24小时
        DELAY: 60 * 60 * 2, // token 过期后在 2小时 内可刷新
        WX: { // 微信小程序信息配置
          APP_ID: 'wx15b4165798ef239f',
          APP_SECRET: 'e6f25f907790b77055c731eae3fdc36e',
          LOGIN_URL: 'https://api.weixin.qq.com/sns/jscode2session?appid=%s&secret=%s&js_code=%s&grant_type=authorization_code'
        },
        BASE_URL: 'http://106.55.153.80:3000/', // 默认路径
      }

    // 测试环境
    default:
      return {
        ENV: 'dev',
        PORT: 3000,
        HTTPS_PORT: 443,
        ALLOW_MULTIPLE: false, // 是否允许同一账号同时登陆多个设备
        VERIFY_CHECK_FILE: true, // 是否对文件查看进行权限判断(私密文件必须登录)
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
        SECRET_KEY: 'PC', // token 秘钥
        EXPIRES_IN: 60 * 60 * 24, // token 有效时间默认 24小时
        DELAY: 60 * 60 * 2, // token 过期后在 2小时 内可刷新
        WX: { // 微信小程序信息配置
          APP_ID: 'wx15b4165798ef239f',
          APP_SECRET: 'e6f25f907790b77055c731eae3fdc36e',
          LOGIN_URL: 'https://api.weixin.qq.com/sns/jscode2session?appid=%s&secret=%s&js_code=%s&grant_type=authorization_code'
        },
        BASE_URL: 'http://localhost:3000/', // 默认路径
      }
  }
}

export default InitConfig()