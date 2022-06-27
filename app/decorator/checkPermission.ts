import { Controller } from 'egg';
import { GlobalErrorTypes } from '../error';

export default function checkPermission(modelName: string, errorType: GlobalErrorTypes, userKey = 'user') {
  return function(prototype, key: string, descriptor: PropertyDescriptor) {
    const originMethod = descriptor.value;
    descriptor.value = async function(...args: any[]) {
      const _self = this as Controller;
      // eslint-disable-next-line
      // @ts-ignore
      const { ctx } = _self;
      const { id } = ctx.params;
      const userId = ctx.state.user._id;
      const certianRecord = await ctx.model[modelName].findOne({ id });
      if (!certianRecord || certianRecord[userKey].toString() !== userId) {
        return ctx.helper.error({ ctx, errorType });
      }
      await originMethod.apply(this, args);
    };
  };
}
