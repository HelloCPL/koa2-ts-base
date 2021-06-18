/**
 * @description: 非全局枚举
 * @author chen
 * @update 2021-06-18 10:05:42
*/

// 平台类型代号
export enum Terminal {
  management = 1,
  pc = 2,
  mobile = 3,
  wechat = 4,
  app = 5
}
// console.log(Terminal.app); // 5
// console.log(Terminal[3]); // 'mobile'