import { Controller } from 'egg';

const userCreateRules = {
  username: 'email',
  password: { type: 'password', min: 8 },
};

const veriCodeRules = {
  phoneNumber: { type: 'string', format: /^1[356789][0-9]{9}$/ },
};

export const userErrorMessages = {
  inputValidateFail: {
    errno: 101001,
    message: '输入信息验证失败',
  },
  createUserExistsFail: {
    errno: 101002,
    message: '用户已存在, 请直接登录',
  },
  loginCheckFail: {
    errno: 101003,
    message: '用户名或密码验证失败',
  },
  loginValidateFail: {
    errno: 101004,
    message: '登录校验失败',
  },
  veriCodePhoneNumberFail: {
    errno: 101005,
    message: '手机号格式有误',
  },
  veriCodeFrequentlyFail: {
    errno: 101006,
    message: '获取验证码频繁',
  },
};

export default class UserController extends Controller {
  async createByEmail() {
    const { ctx, service } = this;
    const errors = this.validateUserInput(userCreateRules);
    if (errors) {
      return ctx.helper.error({ ctx, errorType: 'inputValidateFail', error: errors });
    }
    const { username } = ctx.request.body;
    const user = await service.user.findByUsername(username);
    if (user) {
      return ctx.helper.error({ ctx, errorType: 'createUserExistsFail' });
    }
    const userData = await service.user.createByEmail(ctx.request.body);
    ctx.helper.success({ ctx, res: userData });
  }

  /** 验证输入数据格式是否正确*/
  validateUserInput(rules) {
    const { ctx, app } = this;
    const errors = app.validator.validate(rules, ctx.request.body);
    ctx.logger.warn(errors);
    return errors;
  }

  /** 手机号验证码获取*/
  async getVeriCode() {
    const { ctx, app } = this;
    //  验证输入手机号格式
    const errors = this.validateUserInput(veriCodeRules);
    if (errors) {
      return ctx.helper.error({ ctx, errorType: 'veriCodePhoneNumberFail', error: errors });
    }
    //  1.判断验证码是否存在 redis 中
    //  验证码存储格式 phoneVeriCode-18958849752
    const { phoneNumber } = ctx.request.body;
    const prevVeriCode = await app.redis.get(`phoneVeriCode-${phoneNumber}`);
    //  2. 存在, 返回频繁
    if (prevVeriCode) {
      return ctx.helper.error({ ctx, errorType: 'veriCodeFrequentlyFail', error: errors });
    }
    //  3.1 不存在, 生成验证码并存储到 redis, 过期时间为 60s
    const veriCode = Math.floor((Math.random() * 9000 + 1000));
    await app.redis.set(`phoneVeriCode-${phoneNumber}`, veriCode, 'ex', 60);
    //  3.2 返回验证码
    ctx.helper.success({ ctx, res: { veriCode } });
  }

  /** 用户登录 - 邮箱*/
  async loginByEmail() {
    const { ctx, service, app } = this;
    //  检查用户输入
    const error = this.validateUserInput(userCreateRules);
    if (error) {
      return ctx.helper.error({ ctx, errorType: 'inputValidateFail' });
    }
    //  检查用户是否存在
    const { username, password } = ctx.request.body;
    const user = await service.user.findByUsername(username);
    if (!user) {
      return ctx.helper.error({ ctx, errorType: 'loginCheckFail' });
    }
    //  验证密码是否正确
    const verifyPwd = await ctx.compare(password, user.password);
    if (!verifyPwd) {
      return ctx.helper.error({ ctx, errorType: 'loginCheckFail' });
    }
    //  设置 cookie, encrypt 属性表示对 cookie 进行加密
    // ctx.cookies.set('username', user.username, { encrypt: true });
    //  设置 session
    // ctx.session.username = user.username;

    //  使用 egg-jwt 在 app 上扩展的 jwt 对象进行 sign 调用
    const token = app.jwt.sign({ username }, app.config.jwt.secret, { expiresIn: 60 * 60 });
    ctx.helper.success({ ctx, res: { token }, msg: '登录成功' });
  }

  async current() {
    const { ctx, service } = this;
    //  加密的 cookie 进行访问, 也必须天极爱 encrypt 属性
    // const username = ctx.cookies.get('username', { encrypt: true });
    // const { username } = ctx.session;
    // if (!username) {
    //  return ctx.helper.error({ ctx, errorType: 'loginCheckFail' });
    // }
    // ctx.helper.success({ ctx, res: { username } });

    const userData = await service.user.findByUsername(ctx.state.user.username);
    ctx.helper.success({ ctx, res: userData });
  }
}
