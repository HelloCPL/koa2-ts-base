/**
 * @description: 逻辑业务处理
 * @author chen
 * @update 2021-01-19 16:37:52
*/

import { ValidatorParameter } from '../validator'

export async function myTest(ctx, next) {
  // isOptional
  // isLength
  // isInt
  // isFloat
  // isBoolean
  // isLength
  const v = await new ValidatorParameter({
    key: 'a',
    rules: ['isLength', '邮箱格式不对']
  }).validate(ctx)

  console.log(v.data);
  throw new global.Success()
}