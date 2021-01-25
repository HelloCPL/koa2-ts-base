/**
 * @description: 定义常用的校验方法
 * @author chen
 * @update 2021-01-20 15:50:57
 * @remark 校验方式参考 https://www.npmjs.com/package/validator
*/

import { Rule, LinValidator } from '../lib/lin-validator'

class ValidatorParam extends LinValidator {
  constructor() {
    super()
  }

  protected setRule(rule: any) {
    if (!global._.isArray(rule.rules) || rule.rules.length === 0)
      throw new global.ExceptionHttp({message: global.Message.rules})
    let ruleList = []
    if (global._.isArray(rule.rules[0])) {
      rule.rules.forEach((item: any) => {
        ruleList.push(
          new Rule(item[0], item[1])
        )
      })
    } else {
      ruleList.push(
        new Rule(rule.rules[0], rule.rules[1])
      )
    }
    // @ts-ignore
    this[rule.key] = ruleList
  }
}

/**
 * @author chen
 * @params { key, rules => [type, msg, rule] || [ [type, msg, rule], ... ] }
 * @description: 校验一个参数
 * @update 2021-01-20 15:52:12
*/

export class ValidatorParameter extends ValidatorParam {
  constructor(rules: any) {
    super()
    if (global._.isPlainObject(rules)) {
      this.setRule(rules)
    } else {
      throw new global.ExceptionHttp({message: global.Message.rules})
    }
  }
}

/**
 * @author chen
 * @params 
 * @description: 校验多个参数
 * @update 2021-01-20 15:53:45
*/

export class ValidatorParameters extends ValidatorParam {
  constructor(rules: any) {
    super()
    if (global._.isArray(rules)) {
      for (let i = 0, len = rules.length; i < len; i++) {
        let rule = rules[i]
        this.setRule(rule)
      }
    } else {
      throw new global.ExceptionHttp({message: global.Message.rules})
    }
  }
}

