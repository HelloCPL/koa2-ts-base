## ---------------- 上传文件/图片 ---------------------

#### 简要描述

- 上传一个或多个文件/图片，返回数组对象格式

#### 请求

- `post` `file/upload`

#### 参数

- 字段名称 file

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| secret | string | 否 | 是否私有文件 默认 0 ，`query` 传参 |
| isLogin | string | 否 | 是否登录后才能查看 默认 1 ，`query` 传参 |

#### 返回示例

```
  {
    "code": 200,
    "message": "操作成功",
    "data": [
      {
        "id": "846de434-f5e1-4a87-a475-4e4b295bcf3f",
        "filePath": "http://localhost:3000/files/fb9a9240-7fed-11eb-a451-855b7dbb424c.jpg",
        "fileName": "timg.jpg",
        "fileSize": 12173,
        "createTime": "2021-03-08 17:09:27",
        "suffix": "jpg"
      },
      {
        "id": "d907bb19-44e6-48c3-9834-d1eb57a0384e",
        "filePath": "http://localhost:3000/files/fba2cfa0-7fed-11eb-a451-855b7dbb424c.docx",
        "fileName": "测试.docx",
        "fileSize": 13637,
        "createTime": "2021-03-08 17:09:27",
        "suffix": "docx"
      }
    ],
    "total": 0
  }
```

## ---------------- 删除文件/图片 ---------------------

#### 简要描述

- 删除一个或多个文件/图片 

#### 请求

- `get` `file/delete`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| ids | string | 是 | 文件/图片 ids 用逗号隔开 |

#### 返回示例

```
{
  "code": 200,
  "message": "操作成功",
  "data": null,
  "total": 0
}
```