/**
 * @description: 博客相关操作
 * @author chen
 * @update 2021-03-10 14:55:00
*/


import Koa from 'koa'
import { query, execTrans } from '../../db'

/**
 * 1 用户注册
*/
export async function doBlogList(ctx: Koa.Context, next?: any) {
  let i = ctx.data.query.i
  let total = i * 4 + 1
  let dataList: any[] = []
  let wordList = ['的', '集', '啊', '环境', '科技', '发', '为', '广大', '空格', '个', '安抚', '方法', '是', '都是', '安静', '美好', '请求', '请问', '评论', '都是', '飘了', '二维', '模型', '制作', '详细', '速度', '嗯嗯', '而非', '更换', '天天', '行高', '匹配', '殴打']
  let getRandom = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min)) + min
  }
  let getTitle = (num?: number) => {
    let title = ''
    let len = num || getRandom(10, 50)
    for (let i = 0; i < len; i++) {
      let index = getRandom(0, 32)
      title += wordList[index]
    }
    return title
  }
  for (let i = 0; i < total; i++) {
    let len = getRandom(10, 12)
    let obj = {
      id: global.tools.getUuId(),
      title: getTitle(len),
      desc: getTitle(),
      createTime: global.tools.getCurrentTime()
    }
    dataList.push(obj)
  }
  throw new global.Success({
    data: dataList,
    total: total
  })
}

