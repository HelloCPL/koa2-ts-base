/**
 * @description: 文件上传模块 业务处理
 * @author chen
 * @update 2021-02-05 16:59:01
 * @list 方法集合说明
 *   doFileUpload // 文件文件上传 可上传一个或多个文件 返回数组格式
 *   doFileUploadEditor // 富文本文件文件上传 可上传一个或多个文件 返回数组格式
 *   doFileDelete // 文件删除 传 ids 可删除多个 用逗号隔开
 *   doFileUploadImgOne // 图片上传 可上传一个返回对象格式
 *   getFileById // 单个文件 根据文件/图片 id 返回文件对象数据 没有返回 null
 *   getFileByIds // 多个文件 根据文件/图片 ids 用逗号隔开 返回文件数组对象数据 没有返回 []
*/

import Koa from 'koa'
import fs from 'fs'
import path from 'path'
import { query, execTrans } from '../../db'
import { encrypt } from '../../utils/crypto'
import _ from 'lodash'
import dayjs from 'dayjs'
import CONFIG from '../../config/index'
import { getFileRandomName, getUuId, getCurrentTime } from '../../utils/tools'

/**
 * 文件文件上传 可上传一个或多个文件 返回数组格式
*/
export async function doFileUpload(ctx: Koa.Context, next?: any) {
  const files: any = ctx.request.files
  const file: any = files.file
  const fileList = []
  if (_.isArray(file)) {
    for (let value of file) {
      const obj = await writeFile(ctx, value)
      if (obj) fileList.push(obj)
    }
  } else {
    const obj = await writeFile(ctx, file)
    if (obj) fileList.push(obj)
  }
  throw new global.Success({
    data: fileList
  })
}

/**
 * 富文本文件文件上传 可上传一个或多个文件 返回数组格式
*/
export async function doFileUploadEditor(ctx: Koa.Context, next?: any) {
  ctx.request.query.checkValidTime = 36500
  const files: any = ctx.request.files
  const file: any = files.file
  const fileList = []
  if (_.isArray(file)) {
    for (let value of file) {
      const obj = await writeFile(ctx, value, 'editors')
      if (obj) fileList.push(obj)
    }
  } else {
    const obj = await writeFile(ctx, file, 'editors')
    if (obj) fileList.push(obj)
  }
  throw new global.Success({
    data: fileList
  })
}

/**
 * 文件删除 传 ids 可删除多个 用逗号隔开
*/
export async function doFileDelete(ctx: Koa.Context, next?: any) {
  // 先删除数据库数据
  const ids: any = ctx.data.query.ids
  let sql1 = `SELECT file_path as filePath FROM files_info WHERE FIND_IN_SET(id, ?)`
  let sql2 = `DELETE FROM files_info WHERE FIND_IN_SET(id, ?)`
  let params = [
    { sql: sql1, data: ids },
    { sql: sql2, data: ids },
  ]
  const res: any = await execTrans(params)
  // 再删除文件
  let filePaths: any = res[0]
  if (filePaths.length) {
    for (let i = 0, len = filePaths.length; i < len; i++) {
      let filePath = path.join(__dirname, '../../../static/files', filePaths[i]['filePath'])
      let stat = fs.statSync(filePath)
      if (stat.isFile())
        fs.unlinkSync(filePath)
    }
  }
  throw new global.Success()
}

/**
 * 图片上传 可上传一个返回对象格式
*/
export async function doFileUploadImgOne(ctx: Koa.Context, next?: any) {
  const files: any = ctx.request.files
  const file: any = files.file
  if (!file.type.startsWith('image'))
    throw new global.ExceptionParameter({
      message: '只能上传图片类型'
    })
  const fileObj = await writeFile(ctx, file)
  return fileObj
}

/**
 * 写入文件并写入数据库
*/
async function writeFile(ctx: Koa.Context, file: any, place?: string) {
  place = place || 'files'
  const secret = ctx.request.query.secret || '0'
  const isLogin = ctx.request.query.isLogin || '1'
  const checkValidTime = ctx.request.query.checkValidTime || 3
  const fileName = getFileRandomName(file.name)
  // 先写入数据库
  let id = getUuId()
  let createTime = getCurrentTime()
  let suffix = getSuffix(file.name)
  let sql = `INSERT files_info (id, file_path, file_name, file_size, create_time, suffix, secret, is_login, create_user, check_valid_time, place) VALUES(?,?,?,?,?,?,?,?,?,?,?)`
  let data = [id, fileName, file.name, file.size, createTime, suffix, secret, isLogin, ctx.user.id, checkValidTime, place]
  await query(sql, data)
  // 再创建可读流
  const reader = fs.createReadStream(file.path)
  const fileSavePath = path.join(__dirname, `../../../static/${place}`, fileName)
  const upStream = fs.createWriteStream(fileSavePath)
  reader.pipe(upStream)
  const targetFile = await getFileById(ctx, id)
  return targetFile
}

// 获取后缀名
function getSuffix(name: string) {
  let suffix,
    i = name.lastIndexOf('.')
  if (i !== -1) suffix = name.substring(i + 1)
  return suffix
}

/**
 * 单个文件 根据文件/图片 id 返回文件对象数据 没有返回 null
 * 参数 id 文件id  isUser 是否返回创建者id字段，默认不返回
*/
export async function getFileById(ctx: Koa.Context, id: any, isUser?: boolean) {
  if (!id) return null
  let sql = `SELECT * FROM files_info WHERE id = ?`
  const res: any = await query(sql, id)
  if (res && res.length) {
    let file: any = res[0]
    return returnFileObj(ctx, file, isUser)
  }
  return null
}

/**
 * 多个文件 根据文件/图片 ids 用逗号隔开 返回文件数组对象数据 没有返回 []
*/
export async function getFileByIds(ctx: Koa.Context, ids: any, isUser?: boolean) {
  if (!ids) return []
  let sql = `SELECT * FROM files_info WHERE FIND_IN_SET(id, ?)`
  const res: any = await query(sql, ids)
  let fileList: any[] = []
  res.forEach((item: any) => {
    let file = returnFileObj(ctx, item, isUser)
    if (file) fileList.push(file)
  });
  return fileList
}

// 返回文件格式
function returnFileObj(ctx: Koa.Context, file: any, isUser?: boolean) {
  if (!file) return null
  // 判断是否需要登录可获取
  if (file.is_login === 1 && !ctx.user.id) return null
  // 判断是否私有照片
  if (file.secret === 1 && (!ctx.user.id || ctx.user.id !== file.create_user)) return null
  let filePath = CONFIG.BASE_URL + file.place + '/' + file.file_path
  let queryParams = '?'
  if (file.is_login === 1) { // 给两天有效期
    let day = file.check_valid_time || 3
    let vt: any = dayjs().valueOf() + day * 24 * 60 * 60 * 1000
    vt = encrypt(vt)
    queryParams += `vt=${vt}`

  }
  if (file.secret === 1) { // 添加用户id
    let si = ctx.user.id
    si = encrypt(si)
    if (queryParams === '?') queryParams += `si=${si}`
    else queryParams += `&si=${si}`
  }
  if (queryParams !== '?') filePath += queryParams
  let fileObj: ObjectAny = {
    id: file.id,
    file_name: file.file_name,
    file_size: file.file_size,
    create_time: file.create_time,
    suffix: file.suffix,
    file_path: filePath,
  }
  if (isUser) fileObj.create_user = file.create_user
  return fileObj
}

