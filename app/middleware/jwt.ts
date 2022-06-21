import { Context, EggAppConfig } from 'egg';
import { verify } from 'jsonwebtoken';

/**  获取 token*/
const getTokenValue = (ctx: Context) => {
  const { authorization } = ctx.header;
  if (!ctx.header || !authorization) {
    return false;
  }
  if (typeof authorization === 'string') {
    const parts = authorization.trim().split(' ');
    if (parts.length === 2) {
      const scheme = parts[0];
      const credentials = parts[1];
      if (/^Bearer$/i.test(scheme)) {
        return credentials;
      }
    } else {
      return false;
    }
  }
};

export default (options: EggAppConfig['jwt']) => {
  return async (ctx: Context, next: () => Promise<any>) => {
    //  从 header 中获取对应的 token
    const token = getTokenValue(ctx);
    if (!token) {
      return ctx.helper.error({ ctx, errorType: 'loginValidateFail' });
    }
    //  判断 secret 是否存在
    const { secret } = options;
    if (!secret) {
      throw new Error('Secret not provided');
    }
    try {
      const decoded = verify(token, options.secret);
      ctx.state.user = decoded; //  ctx.state 用于保存通过中间件传输的数据
      await next();
    } catch (error) {
      return ctx.helper.error({ ctx, errorType: 'loginValidateFail' });
    }
  };
};
