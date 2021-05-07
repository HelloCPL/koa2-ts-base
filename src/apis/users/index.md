## ---------------- 用户注册 (待完善，前端密码暂未加密传输) ---------------------

#### 简要描述

- `management` `pc` `mobile` `app` 端的用户注册

#### 请求

- `post` `users/register`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| phone | string | 是 | 手机号 |
| word-info | string | 是 | 放在headers请求头，加密后的密码 |
| userName | string | 否 | 用户昵称 |

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
      "sex": 1,
      "birthday": null,
      "address": null,
      "professional": null,
      "headImg": {
          "id": "8397949b-83fa-4446-82ef-e09f2a3999be",
          "fileName": "timg.jpg",
          "fileSize": 12173,
          "createTime": "2021-03-08 14:41:37",
          "suffix": "jpg",
          "filePath": "http://localhost:3000/files/55268270-7fd9-11eb-ad4e-530e657b08cb.jpg"
      },
      "openid": null,
      "updateTime": "2021-03-08 09:49:49"
      "createTime": "2021-03-08 09:49:49"
    },
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

## ---------------- 获取指定用户信息 ---------------------

#### 简要描述

- `management` `pc` `mobile` `app` 端获取指定用户信息

#### 请求

- `get` `users/info`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| id | string | 是 | 用户 id |

#### 返回示例

```
  {
    "code": 200,
    "message": "操作成功",
    "data": {
      "id": "9b813767-0e2b-46c6-b1df-e97045a3ac04",
      "userName": "测试张三",
      "phone": "15820290006",
      "sex": 1,
      "birthday": null,
      "address": null,
      "professional": null,
      "headImg": null,
      "openid": null,
      "updateTime": "2021-03-08 09:49:49"
      "createTime": "2021-03-08 09:49:49"
    },
    "total": 0
  }
```

## ---------------- 完善本用户信息 ---------------------

#### 简要描述

- `management` `pc` `mobile` `app` 端完善本用户信息

#### 请求

- `post` `users/edit/self`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| userName | string | 否 | 用户昵称 |
| usersexName | tinyint | 否 | 用户性别 1 男 2 女 0 未知 |
| birthday | string | 否 | 用户生日（时间格式字符串） |
| address | string | 否 | 用户地址 |
| professional | string | 否 | 用户职位 |

#### 返回示例

```
  {
    "code": 200,
    "message": "操作成功",
    "data": null,
    "total": 0
  }
```

## ---------------- 完善指定用户信息 ---------------------

#### 简要描述

- `management` 端获取指定用户信息

#### 请求

- `post` `users/edit`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| id | string | 是 | 用户 id |
| userName | string | 否 | 用户昵称 |
| usersexName | tinyint | 否 | 用户性别 1 男 2 女 0 未知 |
| birthday | string | 否 | 用户生日（时间格式字符串） |
| address | string | 否 | 用户地址 |
| professional | string | 否 | 用户职位 |

#### 返回示例

```
  {
    "code": 200,
    "message": "操作成功",
    "data": null,
    "total": 0
  }
```

## ---------------- 更换本用户头像信息 ---------------------

#### 简要描述

- `pc` `mobile` `app` 端获取指定用户信息

#### 请求

- `post` `users/edit/avatar/self`

#### 参数

- 上传单张图片 字段名称 file

#### 返回示例

```
  {
    "code": 200,
    "message": "操作成功",
    "data": {
      "id": "8397949b-83fa-4446-82ef-e09f2a3999be",
      "filePath": "http://localhost:3000/files/55268270-7fd9-11eb-ad4e-530e657b08cb.jpg",
      "fileName": "timg.jpg",
      "fileSize": 12173,
      "createTime": "2021-03-08 14:41:37",
      "suffix": "jpg"
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