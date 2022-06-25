import { Context } from 'egg';
import { userErrorMessages } from '../controller/user';
import { workErrorMessages } from '../controller/work';

interface RespType {
  ctx: Context,
  res?: any,
  msg?: string
}

interface ErrorRespType {
  ctx: Context,
  errorType: keyof (typeof userErrorMessages & typeof workErrorMessages),
  error?: any
}

const globalErrorMessage = {
  ...userErrorMessages,
  ...workErrorMessages,
};

export default {
  success({ ctx, res, msg }: RespType) {
    ctx.body = {
      errno: 0,
      data: res ? res : null,
      message: msg ? msg : '请求成功',
    };
    ctx.status = 200;
  },
  error({ ctx, errorType, error }: ErrorRespType) {
    const { errno, message } = globalErrorMessage[errorType];
    ctx.body = {
      errno,
      msg: message,
      ...(error && { error }),
    };
    ctx.status = 200;
  },
};
