
## ---------------- 用户登录（小程序端） ---------------------

#### 简要描述

- `wechat` 小程序端的用户登录

#### 请求

- `post` `users/login/wechat`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| code | string | 是 | 微信 code |
| avatarUrl | string | 否 | 微信的头像 |
| nickName | string | 否 | 微信的昵称 |
| country | string | 否 | 微信的国家 |
| province | string | 否 | 微信的省份 |
| city | string | 否 | 微信的城市 |
| language | string | 否 | 微信选择的语言 |

#### 返回示例

```
  {
    "code": 200,
    "message": "操作成功",
    "data": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjliODEzNzY3LTBlMmItNDZjNi1iMWRmLWU5NzA0NWEzYWMwNCIsInBob25lIjoiMTU4MjAyOTAwMDYiLCJvcGVuaWQiOm51bGwsImRlbGF5VGltZSI6MTYxNDk0MTE5NywidGVybWluYWwiOiJQQyIsInVzZXJBZ2VudCI6IlBvc3RtYW5SdW50aW1lLzcuMjYuOCIsImlhdCI6MTYxNDg0NzU5NywiZXhwIjoxNjE0OTMzOTk3fQ.HGA6DNRyFwazUQodhpbbtru2RtqVA5CBAo17VItrHVU",
    "total": 0
  }
```


## ---------------- 获取本用户信息(小程序用户) ---------------------

#### 简要描述

- `wechat` 小程序端获取本用户信息，如果关联了账号，会把用户关联信息一起返回

#### 请求

- `get` `users/info/self`

#### 参数

- 无（请求头需带上token）

#### 返回示例

```
  {
    "code": 200,
    "message": "操作成功",
    "data": {
      "avatarUrl": "https://thirdwx.qlogo.cn/mmopen/vi_32/qwKmia9TBmvibFyYUFdvRcWHD9r8EmTbrMFLWffncDt72YNia9JCg1Bqgn2nJZDlrwF7685npT7p9pX078CP9Otyw/132",
      "city": "",
      "country": "",
      "headImg": null,
      "id": "9b813767-0e2b-46c6-b1df-e97045a3ac04",
      "language": "zh_CN",
      "nickName": "零陵上将军",
      "openid": "oZ9dO5Pi46v3m0AJj6vGXxwPmqsQ",
      "userName": "测试张三",
      "phone": "15820290006",
      "province": ""
      "headImg": null,
      "createTime": null, // 小程序账号创建时间
    },
    "total": 0
  }
```

## ---------------- 小程序关联账号 ---------------------

#### 简要描述

- `wechat` 小程序关联账号，并返回新的token，前端需要重新更新 token 和 请求新的用户信息

#### 请求

- `post` `users/info/associate`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| phone | string | 是 | 手机号 |
| password | string | 是 | 加密后的密码 |

#### 返回示例

```
  {
    "code": 200,
    "message": "操作成功",
    "data": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjliODEzNzY3LTBlMmItNDZjNi1iMWRmLWU5NzA0NWEzYWMwNCIsInBob25lIjoiMTU4MjAyOTAwMDYiLCJvcGVuaWQiOm51bGwsImRlbGF5VGltZSI6MTYxNDk0MTE5NywidGVybWluYWwiOiJQQyIsInVzZXJBZ2VudCI6IlBvc3RtYW5SdW50aW1lLzcuMjYuOCIsImlhdCI6MTYxNDg0NzU5NywiZXhwIjoxNjE0OTMzOTk3fQ.HGA6DNRyFwazUQodhpbbtru2RtqVA5CBAo17VItrHVU",
    "total": 0
  }
```