/**
 * @description token权限校验
 * @author chen
 * @update 2021-01-21 14:23:03
*/

// import BasicAuth from 'basic-auth'
// import Jsonwebtoken from 'jsonwebtoken'

// // const {
// //   SECRET_KEY,
// //   EXPIRES_IN
// // } = global.CONFIG.SECURITY_APP

// export class Auth {
//   constructor() { }

//   get mm() {
//     console.log(11);
//     return async (ctx: any, next: any) => {
//       console.log(222);
//       await next()
//     }
//   }
// }

import * as Koa from 'koa';
export default async (ctx: Koa.Context, next: any) => {
  console.log(111);
  try {
    await next();
  } catch (err) {
    console.log(22, 'err');
  }
}

// export default Auth













