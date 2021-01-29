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
        SECURITY_MANAGEMENT: { // PC管理端 token 配置
          SECRET_KEY: 'MANAGEMENT_603PILOGING',
          EXPIRES_IN: 60 * 60 * 24, // 有效时间默认 24小时
          DELAY: 60 * 60 * 2 // token过期后在 2小时 内可刷新
        },
        SECURITY_PC: { // PC端 token 配置
          SECRET_KEY: 'PC_603PILOGING',
          EXPIRES_IN: 60 * 60 * 24, // 有效时间默认 24小时
          DELAY: 60 * 60 * 2 // token过期后在 2小时 内可刷新
        },
        SECURITY_MOBILE: { // 移动端 token 配置
          SECRET_KEY: 'MOBILE_603PILOGING',
          EXPIRES_IN: 60 * 60 * 24, // 有效时间默认 24小时
          DELAY: 60 * 60 * 2 // token过期后在 2小时 内可刷新
        },
        SECURITY_WECHAT: { // 微信小程序端 token 配置
          SECRET_KEY: 'WECHAT_603PILOGING',
          EXPIRES_IN: 60 * 60 * 24, // 有效时间默认 24小时
          DELAY: 60 * 60 * 2 // token过期后在 2小时 内可刷新
        },
        SECURITY_APP: { // APP端 token 配置
          SECRET_KEY: 'APP_603PILOGING',
          EXPIRES_IN: 60 * 60 * 24, // 有效时间默认 24小时
          DELAY: 60 * 60 * 2 // token过期后在 2小时 内可刷新
        },
        WX: { // 微信小程序信息配置
          APP_ID: 'wx15b4165798ef239f',
          APP_SECRET: 'e6f25f907790b77055c731eae3fdc36e',
          LOGIN_URL: 'https://api.weixin.qq.com/sns/jscode2session?appid=%s&secret=%s&js_code=%s&grant_type=authorization_code'
        },
        BASE_URL: 'http://106.55.153.80:3000/',
        FILE_URL: 'http://106.55.153.80:3000/static/file/',
        IMAGE_URL: 'http://106.55.153.80:3000/static/image/'
      }

    // 测试环境
    default:
      return {
        ENV: 'dev',
        PORT: 3000,
        HTTPS_PORT: 443,
        ALLOW_MULTIPLE: true, // 是否允许同一账号同时登陆多个设备
        CRYPTOJS_KEY: 'thisisacryptojskey63', // crypto-js 加密字符
        CRYPTOJS_IV: 'thisisacryptojsiv63', // crypto-js 加密字符
        DATABASE: { // 数据库配置
          // NAME: 'introduce-test',
          NAME: 'dormitory',
          USER: 'root',
          PASSWORD: 'CPLabc603.',
          HOST: '106.55.153.80',
          PORT: 3306,
          CONNECTION_LIMIT: 500
        },
        SECURITY_MANAGEMENT: { // PC管理端 token 配置
          SECRET_KEY: 'MANAGEMENT',
          EXPIRES_IN: 60 * 60 * 24, // 有效时间默认 24小时
          DELAY: 60 * 60 * 2 // token过期后在 2小时 内可刷新
        },
        SECURITY_PC: { // PC端 token 配置
          SECRET_KEY: 'PC',
          EXPIRES_IN: 60 * 60 * 24, // 有效时间默认 24小时
          DELAY: 60 * 60 * 2 // token过期后在 2小时 内可刷新
        },
        SECURITY_MOBILE: { // 移动端 token 配置
          SECRET_KEY: 'MOBILE',
          EXPIRES_IN: 60 * 60 * 24, // 有效时间默认 24小时
          DELAY: 60 * 60 * 2 // token过期后在 2小时 内可刷新
        },
        SECURITY_WECHAT: { // 微信小程序端 token 配置
          SECRET_KEY: 'WECHAT',
          EXPIRES_IN: 60 * 60 * 24, // 有效时间默认 24小时
          DELAY: 60 * 60 * 2 // token过期后在 2小时 内可刷新
        },
        SECURITY_APP: { // APP端 token 配置
          SECRET_KEY: 'APP',
          EXPIRES_IN: 60 * 60 * 24, // 有效时间默认 24小时
          DELAY: 60 * 60 * 2 // token过期后在 2小时 内可刷新
        },
        WX: { // 微信小程序信息配置
          APP_ID: 'wx15b4165798ef239f',
          APP_SECRET: 'e6f25f907790b77055c731eae3fdc36e',
          LOGIN_URL: 'https://api.weixin.qq.com/sns/jscode2session?appid=%s&secret=%s&js_code=%s&grant_type=authorization_code'
        },
        BASE_URL: 'http://localhost:3000/',
        FILE_URL: 'http://localhost:3000/static/file/',
        IMAGE_URL: 'http://localhost:3000/static/image/'
      }
  }
}

export default InitConfig()