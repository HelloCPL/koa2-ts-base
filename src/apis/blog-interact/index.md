## ---------------- 点赞 ---------------------

#### 简要描述

- `management` `pc` `mobile` `app` `wechat` 端 点赞 所有端口点赞同步，包括小程序

#### 请求

- `get` `blog/interact/like`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| id | string | 是 | 点赞的文章（话题） id |
| type | string | 否 | 点赞类型 1 文章 其他后续根据需求加 默认 1 |

#### 返回示例

```
  {
    "code": 200,
    "message": "操作成功",
    "data": null,
    "total": 0
  }
```

## ---------------- 取消点赞 ---------------------

#### 简要描述

- `management` `pc` `mobile` `app` `wechat` 端 取消点赞

#### 请求

- `get` `blog/interact/like/cancel`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| id | string | 是 | 取消点赞的文章id |

#### 返回示例

```
  {
    "code": 200,
    "message": "操作成功",
    "data": null,
    "total": 0
  }
```

## ---------------- 收藏 ---------------------

#### 简要描述

- `management` `pc` `mobile` `app` `wechat` 端 收藏 所有端口收藏同步，包括小程序

#### 请求

- `get` `blog/interact/collection`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| id | string | 是 | 收藏的文章（话题） id |
| type | string | 否 | 收藏类型 1 文章 其他后续根据需求加 默认 1 |

#### 返回示例

```
  {
    "code": 200,
    "message": "操作成功",
    "data": null,
    "total": 0
  }
```

## ---------------- 取消收藏 ---------------------

#### 简要描述

- `management` `pc` `mobile` `app` `wechat` 端 取消收藏

#### 请求

- `get` `blog/interact/collection/cancel`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| id | string | 是 | 取消收藏的文章（话题）id |

#### 返回示例

```
  {
    "code": 200,
    "message": "操作成功",
    "data": null,
    "total": 0
  }
```

## ---------------- 评论 ---------------------

#### 简要描述

- `management` `pc` `mobile` `app` `wechat` 端 评论 type 1 直接对文章或话题进行评论 2 回复第一级别的评论

#### 请求

- `post` `blog/interact/comment/add`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| id | string | 是 | 文章（话题）id |
| type | string | 是 | 评论类型 1 文章 2 回复评论 |
| content | string | 是 | 评论内容 |

#### 返回示例

```
  {
    "code": 200,
    "message": "操作成功",
    "data": null,
    "total": 0
  }
```

## ---------------- 删除评论 ---------------------

#### 简要描述

- `management` `pc` `mobile` `app` `wechat` 端 删除评论，仅可删除自己的评论（管理员除外）

#### 请求

- `get` `blog/interact/comment/delete`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| id | string | 是 | 评论id |

#### 返回示例

```
  {
    "code": 200,
    "message": "操作成功",
    "data": null,
    "total": 0
  }
```

## ---------------- 获取评论列表 ---------------------

#### 简要描述

- `management` `pc` `mobile` `app` `wechat` 端 获取评论列表 type 1 获取第一级别评论（即直接对文章（话题）的评论）， 2 获取第二级别评论列表

#### 请求

- `get` `blog/interact/comment/list`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| id | string | 是 | 文章（话题）id 或评论id |
| type | string | 是 | 评论类型 1 第一级别评论（直接对文章的评论） 2 第二级别评论（对第一级别的评论） |
| pageNo | number | 否 | 分页 默认 1 |
| pageSize | number | 否 | 每页页数 默认 1 |

#### 返回示例

```
  {
    "code": 200,
    "message": "操作成功",
    "data": [
      {
        "id": "c833f7de-cb13-4c4d-8823-8d1c473885f2",
        "articleId": "ba8b0ad7-b4f5-431e-8384-c0fa6023ce24",
        "content": "测试联动，第一级别评论2",
        "fromUid": "29d0ecfe-c888-4b76-b95a-349fe81ae4d1",
        "type": "1",
        "source": "2",
        "createTime": "2021-06-24 16:07:29",
        "sourceName": "PC端",
        "fromName": "测试者",
        "isSelf": "1",
        "isDelete": "1",
        "isLike": "0",
        "likeCount": 0,
        "total": 4,
        "toUid": null,
        "toName": ""
      }
    ],
    "total": 0
  }
```