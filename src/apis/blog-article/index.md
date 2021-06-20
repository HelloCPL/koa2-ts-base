## ---------------- 新增博客文章 ---------------------

#### 简要描述

- `management` `pc` `mobile` `app` `wechat` 端 新增博客文章

#### 请求

- `post` `blog/article/add`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| title | string | 否 | 文章标题 |
| content | string | 是 | 文章标题 |
| cover_img | string | 否 | 文章封面图，图片id，多个图片用逗号隔开，最多3张 |
| classify | string | 否 | 自定义分类，多个分类用逗号隔开 |
| tag | string | 否 | 自定义标签，多个标签用逗号隔开 |
| type | tinyint | 是 | 文章类型 1 原创 2 转载 3 翻译 |
| attachment | string | 否 | 附件，文件id，多个附件用逗号隔开，最多3个 |
| is_login | tinyint | 否 | 是否登录可见 1 是 0 不是 默认 0 |
| is_secret | tinyint | 否 | 是否设为隐私文章 1 是 0 不是 默认 0 |
| is_draft | tinyint | 否 | 是否草稿状态 1 是 0 否 默认 0 非草稿状态即发布 |
| is_top | tinyint | 否 | 是否置顶 1 是 0 否 默认 0 仅管理员可设置 |
| is_hot | tinyint | 否 | 是否热门文章 1 是 0 否 默认 0 仅管理员可设置或点赞或收藏最多的文章 |
| remarks | string | 否 | 备注 |

#### 返回示例

```
  {
    "code": 200,
    "message": "操作成功",
    "data": null,
    "total": 0
  }
```