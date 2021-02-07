/**
 * @description: 文件上传模块 业务处理
 * @author chen
 * @update 2021-02-05 16:59:01
*/

import Koa from 'koa'
import fs from 'fs'
import path from 'path'
import { query, execTrans } from '../../db'

/**
 * 文件文件上传 可上传一个或多个文件 返回数组格式
*/
export async function doFileUpload(ctx: Koa.Context, next?: any) {
  const files: any = ctx.request.files
  const file: any = files.file
  const fileList = []
  if (global._.isArray(file)) {
    for (let value of file) {
      const obj = await writeFile(ctx, value)
      fileList.push(obj)
    }
  } else {
    const obj = await writeFile(ctx, file)
    fileList.push(obj)
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
 * 写入文件并写入数据库
*/
async function writeFile(ctx: Koa.Context, file: any, place?: string) {
  place = place || 'files'
  const secret = ctx.request.query.secret || '0'
  const fileName = global.tools.getFileName(file.name)
  // 先写入数据库
  let id = global.tools.getUuId()
  let createTime = global.dayjs().format('YYYY-MM-DD HH:mm:ss')
  let suffix,
    i = file.name.lastIndexOf('.')
  if (i !== -1) suffix = file.name.substring(i + 1)
  let sql = `INSERT files_info (id, file_path, file_name, file_size, create_time, suffix, secret, create_user) VALUES(?,?,?,?,?,?,?,?)`
  let data = [id, fileName, file.name, file.size, createTime, suffix, secret, ctx.user.id]
  await query(sql, data)
  // 再创建可读流
  const reader = fs.createReadStream(file.path)
  const fileSavePath = path.join(__dirname, '../../../static/files', fileName)
  const upStream = fs.createWriteStream(fileSavePath)
  reader.pipe(upStream)
  return {
    id: id,
    filePath: global.CONFIG.BASE_URL + place + '/' + fileName,
    fileName: file.name,
    fileSize: file.size,
    createTime,
    suffix,
  }
}