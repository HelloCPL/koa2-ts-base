#### users_info 用户信息表

- 说明

| 字段名称 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| id | v64 | 是 | 用户id |
| user_name | v64 | 是 | 用户名称 |
| password | v64 | 是 | 用户密码 |
| phone | v11 | 是 | 用户手机号 |
| head_img | v64 | 否 | 用户头像 |
| openid | v64 | 否 | 关联小程序 openid |


#### users_wechat_info 小程序用户信息表

- 说明

| 字段名称 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| openid | v64 | 是 | 微信小程序的 openid 主键 |
| avatar_url | v255 | 否 | 微信小程序的头像地址 |
| nick_name | v64 | 否 | 微信用户的昵称 |
| country | v64 | 否 | 微信用户的国家 |
| province | v64 | 否 | 微信用户的身份 |
| city | v64 | 否 | 微信用户的城市地址 |
| language | v64 | 否 | 微信用户的选择语言 |


#### files_info 文件保存信息表

- 说明

| 字段名称 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| id | v64 | 是 | 文件id |
| file_path | v255 | 是 | 文件路径(仅指文件名称) |
| file_name | v64 | 否 | 原始文件名 |
| file_size | int | 否 | 文件大小，单位 B |
| suffix | v64 | 否 | 文件后缀名 |
| create_user | v64 | 否 | 创建者id |
| create_time | v64 | 否 | 创建时间 |
| secret | tinyint | 否 | 是否为私密文件，1 为私密文件只有创建者可见且删除，默认 0 |
| is_login | tinyint | 否 | 是否需要登录才可查看，1 登录后可查看 0 未登录不可查看，默认 1 |
| place | v64 | 否 | 文件存放位置, 默认 files 目录 |











