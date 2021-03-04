## ---------------- 用户注册 ---------------------

#### 简要描述

- `management` `pc` `mobile` `app` 端的用户注册

#### 请求

- `post` `users/register`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| phone | string | 是 | 手机号 |
| word-info | string | 是 | 放在headers请求头，加密后的密码 |

#### 返回示例

```
  {
    "code": 200,
    "message": "恭喜，注册成功！",
    "data": null,
    "total": 0
  }
```

## ---------------- 用户登录 ---------------------

#### 简要描述

- `management` `pc` `mobile` `app` 端的用户登录

#### 请求

- `post` `users/login`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| phone | string | 是 | 手机号 |
| word-info | string | 是 | 放在headers请求头，加密后的密码 |

#### 返回示例

```
  {
    "code": 200,
    "message": "操作成功",
    "data": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjliODEzNzY3LTBlMmItNDZjNi1iMWRmLWU5NzA0NWEzYWMwNCIsInBob25lIjoiMTU4MjAyOTAwMDYiLCJvcGVuaWQiOm51bGwsImRlbGF5VGltZSI6MTYxNDk0MTE5NywidGVybWluYWwiOiJQQyIsInVzZXJBZ2VudCI6IlBvc3RtYW5SdW50aW1lLzcuMjYuOCIsImlhdCI6MTYxNDg0NzU5NywiZXhwIjoxNjE0OTMzOTk3fQ.HGA6DNRyFwazUQodhpbbtru2RtqVA5CBAo17VItrHVU",
    "total": 0
  }
```

## ---------------- 用户登录（小程序端） ---------------------

#### 简要描述

- `wechat` 小程序端的用户登录

#### 请求

- `post` `users/login`

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

## ---------------- 刷新token ---------------------

#### 简要描述

- 用户token失效后在有效延迟时间内容可重新刷新token，无须再次登录

#### 请求

- `get` `users/token/refresh`

#### 参数

- 无（请求头带上之前的token即可）

#### 返回示例

```
  {
    "code": 200,
    "message": "操作成功",
    "data": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjliODEzNzY3LTBlMmItNDZjNi1iMWRmLWU5NzA0NWEzYWMwNCIsInBob25lIjoiMTU4MjAyOTAwMDYiLCJvcGVuaWQiOm51bGwsImRlbGF5VGltZSI6MTYxNDk0MTE5NywidGVybWluYWwiOiJQQyIsInVzZXJBZ2VudCI6IlBvc3RtYW5SdW50aW1lLzcuMjYuOCIsImlhdCI6MTYxNDg0NzU5NywiZXhwIjoxNjE0OTMzOTk3fQ.HGA6DNRyFwazUQodhpbbtru2RtqVA5CBAo17VItrHVU",
    "total": 0
  }
```

## ---------------- 退出登录 ---------------------

#### 简要描述

- 用户退出登录

#### 请求

- `get` `users/exit`

#### 参数

- 无（请求头需带上token）

#### 返回示例

```
  {
    "code": 200,
    "message": "操作成功",
    "data": "已退出",
    "total": 0
  }
```

## ---------------- 获取本用户信息 ---------------------

#### 简要描述

- `management` `pc` `mobile` `app` 端获取本用户信息

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
      "id": "9b813767-0e2b-46c6-b1df-e97045a3ac04",
      "userName": "测试张三",
      "phone": "15820290006",
      "headImg": null,
      "openid": null
    },
    "total": 0
  }
```

## ---------------- 获取本用户信息(小程序用户) ---------------------

#### 简要描述

- `wechat` 小程序端获取本用户信息

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
    },
    "total": 0
  }
```

## ---------------- 获取指定用户信息 ---------------------

#### 简要描述

- `management` `pc` `mobile` `app` 端获取本用户信息

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
      "id": "9b813767-0e2b-46c6-b1df-e97045a3ac04",
      "userName": "测试张三",
      "phone": "15820290006",
      "headImg": null,
      "openid": null
    },
    "total": 0
  }
```

