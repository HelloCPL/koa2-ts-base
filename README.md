## 项目运行

`npm i`

`npm run dev`

## 项目说明

##### 目录说明

```
  app.ts  ------------------------------ 项目入口
  init.ts  ----------------------------- 项目初始化
  src
    apis  ------------------------------ 接口路由集合目录，主要书写路由集合
    config/index.ts  ------------------- 配置文件
    controller  ------------------------ 业务书写集合目录（注：apis目录声明路由，具体实现方法在controller目录书写）
    db/index.ts  ----------------------- 查询数据库方法集合
    global
      index.ts  ------------------------ 挂载全局变量 global
      enums.ts  ------------------------ 全局枚举声明
    lib  ------------------------------- 引用包目录
    middlewares
      exception/index.ts  -------------- 全局异常处理
      router
        index.ts  ---------------------- 路由注册装饰器
        Route.ts  ---------------------- 路由自动注册
      token-auth/index.ts  ------------- token 权限拦截
    typedts  --------------------------- 全局变量 global 和 安装包的声明
      custom.d.ts  ---------------------- 自定义接口，用于全局范围
      global.d.ts  ---------------------- 全局变量 global 挂载新属性声明
      koa.d.ts  ------------------------- koa 追加 Context 上下文新属性声明
    utils
      crypto.ts  ----------------------- crypto-js 密码加密解密方法
      find-members.ts  ----------------- 自定义查找成员方法
      http-exception.ts  --------------- 设置常用异常类
      tools.ts  ------------------------ 常用方法集合
      validator.ts  -------------------- 定义常用校验方法集合
```

##### 挂载到全局变量 global 的自定义属性说明

```
  global._ // 挂载 lodash，如 global._.isArray([1,2])
  global.tools // 常用方法集合，如 global.tools.toPath('/user', 'list')
  global.CONFIG // 配置，如 global.CONFIG.PORT
  global.Message // 返回提示信息，如 global.Message.error
  global.Code // 返回状态吗，如 global.Code.error
  global.ParamsMessage // 参数提示信息，如 global.ParamsMessage.isLength
  global.ExceptionHttp // 普通系统异常，如 throw new global.ExceptionHttp()
  global.ExceptionParameter // 参数异常，如 throw new global.ExceptionParameter()
  global.ExceptionNotFound // 404 异常，如 throw new global.ExceptionNotFound()
  global.ExceptionForbidden // 无权限异常，如 throw new global.ExceptionForbidden()
  global.ExceptionAuthFailed // 权限不足异常，如 throw new global.ExceptionAuthFailed()
  global.Success // 成功异常类，如 throw new global.Success({data: 1})
```

##### 上下文 Context 附加信息

```
  ctx.data // 获取用户传参，data 包括 query body path header，如 ctx.data.query.age
  ctx.user // 获取当前用户信息
  ctx.terminal // 获取访问的终端
```

##### 自定义接口 用于全局声明

```
  ObjectAny // 任意对象类型
  ObjectException // 错误类接口类型
  ObjectSQLParams // 数据库查询参数接口类型
  ObjectRequired // 路由请求参数接口类型
  ObjectRoute // 自动注册路由传参接口类型
  ArrayAny // 任意数组类型
```

##### 路由装饰器

  - 装饰器执行权重 `Required > Get Post Put Delete > Convert`
  
  - 修饰装饰器时 `Get Post Put Delete` 必须写在 `Required` 前面，如：`@Get('info') @Required(['id'])`

```
  @Prefix 添加路由前缀类装饰器，参数：path 路由前缀，如 @Prefix('user')
  @Get get 请求方法装饰器，参数：path 路由路径；unless? 是否不校验权限；terminals? 支持的终端集合，默认支持 ['management','pc','wechat','mobile', 'app']，如 @Get('info')
  @Post post 请求方法装饰器，参数同上
  @Put put 请求方法装饰器，参数同上
  @Delete delete 请求方法装饰器，参数同上
  @Required 必传参数校验，校验指定类型用 &+类型，参数：params 校验参数集合，如 @Required(['name', 'age&isInt', ''emial&isEmial])
  @Convert 添加中间件处理类装饰器，参数：middleware 中间件，如 @Convert(judgeUser)
```

##### header 请求头参数说明

  - `word-info` // 登录注册时传的密码，用 crypto.js 加密后的字符
  - `Authorization` // 普通请求携带的 token 请求头
  - `user-agent` // 访问平台设备信息

## 流程

- 日志记录

- socket.io 实时发送
- 配置 用户白名单和黑名单 (通过权限)
- 获取 wx openID


- 富文本编辑(暂时不做)

文件上传（koa-body）以及 处理post请求参数
静态资源托管以及资源权限拦截
权限拦截中间件
连接数据库
连接redis
全局方法







