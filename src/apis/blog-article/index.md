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
| coverImg | string | 否 | 文章封面图，图片id，多个图片用逗号隔开，最多3张 |
| classify | string | 否 | 自定义分类，多个分类用逗号隔开 |
| tag | string | 否 | 自定义标签，多个标签用逗号隔开 |
| type | string | 是 | 文章类型 1 原创 2 转载 3 翻译 |
| attachment | string | 否 | 附件，文件id，多个附件用逗号隔开，最多3个 |
| isLogin | string | 否 | 是否登录可见 1 是 0 不是 默认 0 |
| isSecret | string | 否 | 是否设为隐私文章 1 是 0 不是 默认 0 |
| isDraft | string | 否 | 是否草稿状态 1 是 0 否 默认 0 非草稿状态即发布 |
| isTop | string | 否 | 是否置顶 1 是 0 否 默认 0 仅管理员可设置 |
| isHot | string | 否 | 是否热门文章 1 是 0 否 默认 0 仅管理员可设置或点赞或收藏最多的文章 |
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

## ---------------- 编辑博客文章 ---------------------

#### 简要描述

- `management` `pc` `mobile` `app` `wechat` 端 编辑博客文章

#### 请求

- `post` `blog/article/edit`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| id | string | 是 | 文章id |
| title | string | 否 | 文章标题 |
| content | string | 否 | 文章标题 |
| coverImg | string | 否 | 文章封面图，图片id，多个图片用逗号隔开，最多3张 |
| classify | string | 否 | 自定义分类，多个分类用逗号隔开 |
| tag | string | 否 | 自定义标签，多个标签用逗号隔开 |
| type | string | 否 | 文章类型 1 原创 2 转载 3 翻译 |
| attachment | string | 否 | 附件，文件id，多个附件用逗号隔开，最多3个 |
| isLogin | string | 否 | 是否登录可见 1 是 0 不是 默认 0 |
| isSecret | string | 否 | 是否设为隐私文章 1 是 0 不是 默认 0 |
| isDraft | string | 否 | 是否草稿状态 1 是 0 否 默认 0 非草稿状态即发布 |
| isTop | string | 否 | 是否置顶 1 是 0 否 默认 0 仅管理员可设置 |
| isHot | string | 否 | 是否热门文章 1 是 0 否 默认 0 仅管理员可设置或点赞或收藏最多的文章 |
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

## ---------------- 删除博客文章 ---------------------

#### 简要描述

- `management` `pc` `mobile` `app` `wechat` 端 删除博客文章，多个用逗号隔开（作者或管理员可删）

#### 请求

- `get` `blog/article/deletes`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| ids | string | 是 | 文章id，删除多个用逗号隔开 |

#### 返回示例

```
  {
    "code": 200,
    "message": "操作成功",
    "data": null,
    "total": 0
  }
```

## ---------------- 获取指定博客文章 ---------------------

#### 简要描述

- `management` `pc` `mobile` `app` `wechat` 端 获取指定博客文章（isSecret=1 隐私文章仅作者或管理员可查看）

#### 请求

- `get` `blog/article/info`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| id | string | 是 | 文章id |

#### 返回示例

```
  {
    "code": 200,
    "message": "操作成功",
    "data": {
      "id": "bca78715-e15f-4c18-92d2-2b4a31e3ebc6",
      "title": "标题哈哈",
      "content": "大大的标题",
      "coverImg": "6fbc2c29-80ee-4597-bb53-4419d2a5c2df",
      "classify": "大前端",
      "tag": "vue,js,html",
      "type": 1,
      "attachment": "6fbc2c29-80ee-4597-bb53-4419d2a5c2df",
      "createUser": "29d0ecfe-c888-4b76-b95a-349fe81ae4d1",
      "isLogin": 0,
      "isSecret": 1,
      "isDraft": 1,
      "isTop": 1,
      "isHot": 0,
      "source": 2,
      "createTime": "2021-06-21 17:55:40",
      "updateTime": "2021-06-22 10:16:24",
      "remarks": "这是备注哈哈哈",
      "isLike": 1,
      "isCollection": 1
    },
    "total": 0
  }
```

## ---------------- 获取个人博客文章列表 ---------------------

#### 简要描述

- `management` `pc` `mobile` `app` `wechat` 端 获取个人博客文章列表，默认获取非草稿文章列表，可通过参数获取草稿列表

#### 请求

- `get` `blog/article/list/self`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| pageNo | number | 否 | 分页 默认 1 |
| pageSize | number | 否 | 每页页数 默认 10 |
| keyword | string | 否 | 关键词 |
| type | string | 否 | 文章类型 1 原创 2 转载 3 翻译 |
| isSecret | string | 否 | 是否为隐私文章 1 是 0 不是 |
| isDraft | string | 否 | 是否为草稿 1 是 0 不是 默认获取非草稿的文章列表，两者选其一 |
| isTop | string | 否 | 是否为置顶 1 是 0 不是 |
| isHot | string | 否 | 是否为热门文章 1 是 0 不是 |

#### 返回示例

```
  {
    "code": 200,
    "message": "操作成功",
    "data": {
      // ...
    },
    "total": 0
  }
```