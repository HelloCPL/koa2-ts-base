#### users_info 用户信息表

- 说明

| 字段名称 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| id | v64 | 是 | 用户id |
| user_name | v64 | 是 | 用户名称 |
| password | v64 | 是 | 用户密码 |
| phone | v64 | 是 | 用户手机号 |
| sex | tinyint | 否 | 用户性别，1男 2女 0 未知 |
| birthday | v64 | 否 | 用户生日（时间格式的字符串） |
| address | v255 | 否 | 用户地址 |
| professional | v255 | 否 | 用户职业 |
| head_img | v255 | 否 | 用户头像 图片地址id |
| openid | v64 | 否 | 关联小程序 openid |
| is_admin | tinyint | 否 | 是否管理员 1 是 0 否 默认 0 |
| create_time | v64 | 是 | 创建时间 |
| update_time | v64 | 否 | 更新修改时间 |
| remarks | v1000 | 否 | 备注 |


#### users_wechat_info 小程序用户信息表

- 说明

| 字段名称 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| openid | v64 | 是 | 微信小程序的 openid 主键 |
| session_key | v64 | 是 | 微信用户的session_key |
| avatar_url | v255 | 否 | 微信小程序的头像地址 |
| nick_name | v64 | 否 | 微信用户的昵称 |
| country | v64 | 否 | 微信用户的国家 |
| province | v64 | 否 | 微信用户的身份 |
| city | v64 | 否 | 微信用户的城市地址 |
| language | v64 | 否 | 微信用户的选择语言 |
| create_time | v64 | 是 | 创建时间 |


#### files_info 文件保存信息表

- 说明

| 字段名称 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| id | v64 | 是 | 文件id |
| file_path | v255 | 是 | 文件路径(仅指文件名称) |
| file_name | v64 | 否 | 原始文件名 |
| file_size | mediumint | 否 | 文件大小，单位 B |
| suffix | v64 | 否 | 文件后缀名 |
| place | v64 | 否 | 文件存放位置, 默认 files 目录 |
| create_user | v64 | 否 | 创建者id |
| secret | tinyint | 否 | 是否为私密文件，1 为私密文件只有创建者可见且删除，默认 0 |
| is_login | tinyint | 否 | 是否需要登录才可查看，1 登录后可查看 0 未登录不可查看，默认 1 |
| check_valid_time | mediumint | 否 | 文件是隐私时默认可查看时间，默认3天 |
| create_time | v64 | 是 | 创建时间 |
| remarks | v1000 | 否 | 备注 |

#### blog_article 文章信息表

- 说明

| 字段名称 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| id | v64 | 是 | 文章 id |
| title | v1000 | 否 | 文章标题 |
| content | v5000 | 是 | 文章内容 |
| cover_img | v255 | 否 | 文章封面图，图片id |
| classify | v255 | 否 | 自定义分类，多个分类用逗号隔开 |
| tag | v255 | 否 | 自定义标签，多个标签用逗号隔开 |
| type | tinyint | 是 | 文章类型 1 原创 2 转载 3 翻译 |
| attachment | v255 | 否 | 附件，文件id，多个附件用逗号隔开，最多3个 |
| create_user | v64 | 是 | 创建者id 小程序用 openid，其他用来源用户id |
| is_login | tinyint | 否 | 是否登录可见 1 是 0 不是 默认 0 |
| is_secret | tinyint | 否 | 是否设为隐私文章 1 是 0 不是 默认 0 |
| is_draft | tinyint | 否 | 是否草稿状态 1 是 0 否 默认 0 非草稿状态即发布 |
| is_top | tinyint | 否 | 是否置顶 1 是 0 否 默认 0 仅管理员可设置 |
| is_hot | tinyint | 否 | 是否热门文章 1 是 0 否 默认 0 仅管理员可设置或点赞或收藏最多的文章 |
| source | tinyint | 否 | 来源 1 management 2 pc 3 mobile 4 wechat 5 app |
| create_time | v64 | 是 | 创建时间 |
| update_time | v64 | 是 | 最新修改时间 |
| remarks | v1000 | 否 | 备注 |

#### blog_article_like 文章点赞信息表

- 说明，有记录即点赞了，反之没有点赞

| 字段名称 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| id | v64 | 是 | 点赞id |
| article_id | v64 | 是 | 文章id |
| create_user | v64 | 是 | 点赞者 id 小程序用openid 其他来源用用户id |
| create_time | v64 | 是 | 点赞时间 |

#### blog_article_collection 文章收藏信息表

- 说明，有记录即收藏了，反之没有收藏

| 字段名称 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| id | v64 | 是 | 收藏id |
| article_id | v64 | 是 | 文章id |
| create_user | v64 | 是 | 收藏者 id 小程序用openid 其他来源用用户id |
| create_time | v64 | 是 | 收藏时间 |

#### blog_article_collection 文章评论信息表

- 说明，评论最多分二级，直接回复文章为第一级别评论人，在第一级别评论人下的评论都为第二级别

| 字段名称 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| id | v64 | 是 | 评论id |
| article_id | v64 | 是 | 文章id |
| content | v1000 | 是 | 评论内容 |
| parent_id | v64 | 是 | 评论者 id 小程序用openid 其他来源用用户id |
| create_user | v64 | 是 | 评论者 id 小程序用openid 其他来源用用户id |
| is_first_comment | tinyint | 否 | 是否第一级别评论人（即直接评论文章是，回复第一级别评论人不是）1 是 0 否 默认 1 |
| create_time | v64 | 是 | 评论时间 |









