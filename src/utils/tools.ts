/**
 * @description 封装常用方法
 * @author chen
 * @update 2021-01-25 16:03:11
*/

/**
 * 返回格式后的路径
 * 如 member/list 或 member/list/ ==> /member/list
*/
function toPath(path: string) {
  if (path && !path.startsWith('/'))
    path = '/' + path
  if (path && path.endsWith('/'))
    path = path.substring(0, path.length - 1)
  return path
}

/**
 * 确保返回数组集合方法
*/
function sureIsArray(arr: any) {
  return Array.isArray(arr) ? arr : [arr]
}

export default {
  toPath,
  sureIsArray
}