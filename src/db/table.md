#### users_info 用户信息表

- 说明

| 字段名称 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| id | v64 | 是 | 用户id |
| user_name | v64 | 是 | 用户名称 |
| password | v64 | 是 | 用户密码 |
| phone | v64 | 是 | 用户手机号 |
| sex | v4 | 否 | 用户性别，1男 2女 0 未知 |
| birthday | v64 | 否 | 用户生日（时间格式的字符串） |
| address | v255 | 否 | 用户地址 |
| professional | v255 | 否 | 用户职业 |
| head_img | v255 | 否 | 用户头像 图片地址id |
| openid | v64 | 否 | 关联小程序 openid |
| is_admin | v4 | 否 | 是否管理员 1 是 0 否 默认 0 |
| create_time | v64 | 是 | 创建时间 |
| update_time | v64 | 否 | 更新修改时间 |
| remarks | text | 否 | 备注 |


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
| file_size | int | 否 | 文件大小，单位 B |
| suffix | v64 | 否 | 文件后缀名 |
| place | v64 | 否 | 文件存放位置, 默认 files 目录 |
| create_user | v64 | 否 | 创建者id |
| secret | v4 | 否 | 是否为私密文件，1 为私密文件只有创建者可见且删除，默认 0 |
| is_login | v4 | 否 | 是否需要登录才可查看，1 登录后可查看 0 未登录不可查看，默认 1 |
| check_valid_time | mediumint | 否 | 文件是隐私时默认可查看时间，默认3天 |
| create_time | v64 | 是 | 创建时间 |
| remarks | text | 否 | 备注 |

#### blog_article 文章信息表

- 说明

| 字段名称 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| id | v64 | 是 | 文章 id |
| title | text | 否 | 文章标题 |
| content | text | 是 | 文章内容 |
| cover_img | v255 | 否 | 文章封面图，图片id，多个图片用逗号隔开，最多3张 |
| classify | v255 | 否 | 自定义分类，多个分类用逗号隔开 |
| tag | v255 | 否 | 自定义标签，多个标签用逗号隔开 |
| type | v4 | 是 | 文章类型 1 原创 2 转载 3 翻译 |
| attachment | v255 | 否 | 附件，文件id，多个附件用逗号隔开，最多3个 |
| create_user | v64 | 是 | 创建者id 小程序用 openid，其他用来源用户id |
| is_login | v4 | 否 | 是否登录可见 1 是 0 不是 默认 0 |
| is_secret | v4 | 否 | 是否设为隐私文章 1 是 0 不是 默认 0 |
| is_draft | v4 | 否 | 是否草稿状态 1 是 0 否 默认 0 非草稿状态即发布 |
| is_top | v4 | 否 | 是否置顶 1 是 0 否 默认 0 仅管理员可设置 |
| is_hot | v4 | 否 | 是否热门文章 1 是 0 否 默认 0 仅管理员可设置或点赞或收藏最多的文章 |
| source | v4 | 是 | 来源 1 management 2 pc 3 mobile 4 wechat 5 app |
| create_time | v64 | 是 | 创建时间 |
| update_time | v64 | 是 | 最新修改时间 |
| remarks | text | 否 | 备注 |

#### blog_like 点赞信息表

- 说明，有记录即点赞了，反之没有点赞

| 字段名称 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| id | v64 | 是 | id |
| article_id | v64 | 是 | 点赞的文章（话题） id |
| type | v4 | 是 | 点赞类型 1 文章 其他后续加 默认 1 |
| create_user | v64 | 是 | 点赞者 id 小程序用openid 其他来源用用户id |
| create_time | v64 | 是 | 点赞时间 |

#### blog_collection 收藏信息表

- 说明，有记录即收藏了，反之没有收藏

| 字段名称 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| id | v64 | 是 | 收藏id |
| article_id | v64 | 是 | 文章（话题） id |
| type | v4 | 是 | 收藏类型 1 文章 其他后续加 默认 1 |
| create_user | v64 | 是 | 收藏者 id 小程序用openid 其他来源用用户id |
| create_time | v64 | 是 | 收藏时间 |

#### blog_comment 第一级别评论信息表

- 说明，这是直接对文章（话题）的评论，即第一级别评论

| 字段名称 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| id | v64 | 是 | 主键 id |
| article_id | v64 | 是 | 文章（话题） id |
| content | text | 是 | 评论内容 |
| from_uid | v64 | 是 | 评论者 id 小程序用openid 其他来源用用户id |
| type | v4 | 是 | 类型 1 评论 2 问答 |
| source | v4 | 是 | 来源 1 management 2 pc 3 mobile 4 wechat 5 app |
| create_time | v64 | 是 | 评论时间 |

#### blog_comment_child 第二级别评论信息表

- 说明，这是对评论的回复，即第一级别评论下的所有回复，评论只做二级评论

| 字段名称 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| id | v64 | 是 | 主键 id |
| article_id | v64 | 是 | 文章（话题）id，用于统计文章总评论数 |
| first_comment_id | v64 | 是 | 第一级别评论 id, 用于统计第一级别评论底下评论总数 |
| reply_id | v64 | 是 | 回复目标评论id，即回复哪条评论就是哪个评论的id |
| content | text | 是 | 评论内容 |
| from_uid | v64 | 是 | 评论者 id 小程序用openid 其他来源用用户id |
| to_uid | v64 | 是 | 回复目标 id |
| type | v4 | 是 | 类型 1 评论 2 问答 |
| source | v4 | 是 | 来源 1 management 2 pc 3 mobile 4 wechat 5 app |
| create_time | v64 | 是 | 回复时间 |









