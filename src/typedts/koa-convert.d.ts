/**
 * @description 追加 koa-convert
 * @author chen
 * @update 2021-01-23 20:23:32
*/

declare module "koa-convert" {
  import * as Koa from "koa";
  interface Middleware {
    (context: any, next?: () => Promise<void>): Promise<any>;
  }
  function convert(middleware?: Middleware): Koa.Middleware;
  namespace convert { }
  export = convert;
}
