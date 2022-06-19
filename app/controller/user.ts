import { Controller } from 'egg';

const userCreateRules = {
  username: 'email',
  password: { type: 'password', min: 8 },
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
};

export default class UserController extends Controller {
  async createByEmail() {
    const { ctx, service } = this;
    const errors = this.validateUserInput();
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
  validateUserInput() {
    const { ctx, app } = this;
    const errors = app.validator.validate(userCreateRules, ctx.request.body);
    ctx.logger.warn(errors);
    return errors;
  }

  /** 用户登录 - 邮箱*/
  async loginByEmail() {
    const { ctx, service } = this;
    //  检查用户输入
    const error = this.validateUserInput();
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
    ctx.session.username = user.username;
    ctx.helper.success({ ctx, res: user, msg: '登录成功' });
  }

  async current() {
    const { ctx } = this;
    //  加密的 cookie 进行访问, 也必须天极爱 encrypt 属性
    // const username = ctx.cookies.get('username', { encrypt: true });
    const { username } = ctx.session;
    if (!username) {
      return ctx.helper.error({ ctx, errorType: 'loginCheckFail' });
    }
    ctx.helper.success({ ctx, res: { username } });
  }
}
