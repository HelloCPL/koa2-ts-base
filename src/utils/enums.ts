/**
 * @description: 非全局枚举
 * @author chen
 * @update 2021-06-18 10:05:42
 * @list 方法集合说明
 *   Terminal // 平台类型代号
*/

// 平台类型代号
export enum Terminal {
  MANAGEMENT = 1,
  PC = 2,
  MOBILE = 3,
  WECHAT = 4,
  APP = 5
}
// console.log(Terminal.app); // 5
// console.log(Terminal[3]); // 'mobile'