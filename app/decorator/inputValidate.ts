import { Controller } from '../../typings/app';
import { GlobalErrorTypes } from '../error';

/**
 * 装饰器 - 校验用户输入
 * @description 创建工厂函数, 传入 rules 和 errorType*/
export default function validateInput(rules: any, errorType: GlobalErrorTypes) {
  return function(prototype, key: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = function(...agrs: any[]) {
      const _self = this as Controller;
      //  eslint-disable-next-line
      //  @ts-ignore
      const { ctx, app } = _self;
      const errors = app.validator.validate(rules, ctx.request.body);
      if (errors) {
        return ctx.helper.error({ ctx, errorType, error: errors });
      }
      return originalMethod.apply(this, agrs);
    };
  };
}
