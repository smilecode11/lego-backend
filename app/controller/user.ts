import { Controller } from 'egg';
import inputValidate from '../decorator/inputValidate';

const userCreateRules = {
  username: 'email',
  password: { type: 'password', min: 8 },
};

const veriCodeRules = {
  phoneNumber: { type: 'string', format: /^1[356789][0-9]{9}$/ },
};

const userLoginByCellphoneRules = {
  phoneNumber: { type: 'string', format: /^1[356789][0-9]{9}$/ },
  veriCode: { type: 'string', min: 4, max: 4 },
};

export default class UserController extends Controller {
  /** 邮箱创建用户*/
  @inputValidate(userCreateRules, 'inputValidateFail')
  async createByEmail() {
    const { ctx, service } = this;
    const { username } = ctx.request.body;
    const user = await service.user.findByUsername(username);
    if (user) {
      return ctx.helper.error({ ctx, errorType: 'createUserExistsFail' });
    }
    const token = await service.user.createByEmail(ctx.request.body);
    ctx.helper.success({ ctx, res: { token } });
  }

  /** 用户登录 - 邮箱*/
  @inputValidate(userCreateRules, 'inputValidateFail')
  async loginByEmail() {
    const { ctx, service, app } = this;
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
    //  使用 egg-jwt 在 app 上扩展的 jwt 对象进行 sign 调用
    const token = app.jwt.sign({ username, _id: user._id }, app.config.jwt.secret, { expiresIn: 60 * 60 });
    ctx.helper.success({ ctx, res: { token }, msg: '登录成功' });
  }

  /** 手机号验证码获取*/
  @inputValidate(veriCodeRules, 'inputValidateFail')
  async getVeriCode() {
    const { ctx, app } = this;
    //  1.判断验证码是否存在 redis 中
    //  验证码存储格式 key: phoneVeriCode-18958849752 value: 9752
    const { phoneNumber } = ctx.request.body;
    const preVeriCode = await app.redis.get(`phoneVeriCode-${phoneNumber}`);
    //  2. 存在, 返回频繁
    if (preVeriCode) {
      return ctx.helper.error({ ctx, errorType: 'sendVeriCodeFrequentlyFail' });
    }
    //  3.1 不存在, 生成验证码
    const veriCode = Math.floor((Math.random() * 9000 + 1000));
    //  生产环境使用短信服务
    if (app.config.env === 'prod') {
      //  **** 使用 ali 短信服务 ****
      const resp = await ctx.service.user.sendSMS(phoneNumber, veriCode as unknown as string);
      if (resp.body.code !== 'OK') {
        return ctx.helper.error({ ctx, errorType: 'sendVeriCodeFail', error: resp.body });
      }
    }
    //  3.2 存储到 redis, 过期时间为 60s 并返回验证码
    await app.redis.set(`phoneVeriCode-${phoneNumber}`, veriCode, 'ex', 60);
    ctx.helper.success({ ctx, res: app.config.env === 'prod' ? null : { veriCode }, msg: '验证码发送成功' });
  }

  /** 用户登录 - 手机验证码*/
  //  1. 检查输入格式是否正确
  @inputValidate(userLoginByCellphoneRules, 'inputValidateFail')
  async loginByCellphone() {
    const { ctx, app } = this;
    //  2. 检查验证码是否正确
    const { phoneNumber, veriCode } = ctx.request.body;
    const preVeriCode = await app.redis.get(`phoneVeriCode-${phoneNumber}`);
    if (preVeriCode !== veriCode) {
      return ctx.helper.error({ ctx, errorType: 'loginByCellphoneCheckFail' });
    }
    //  3. 检查用户名(手机号)是否注册, 返回 token
    const token = await ctx.service.user.loginByCellphone(phoneNumber);
    ctx.helper.success({ ctx, res: { token } });
  }

  /** 授权页 get*/
  async oauth() {
    const { app, ctx } = this;
    const { cid, redirectURL } = app.config.giteeOauthConfig;
    ctx.redirect(`https://gitee.com/oauth/authorize?client_id=${cid}&redirect_uri=${redirectURL}&response_type=code`);
  }

  /** 授权获取 accessToke*/
  async oauthByGitee() {
    const { ctx } = this;
    const { code } = ctx.request.query;
    try {
      const token = await ctx.service.user.loginByGitee(code);
      // 渲染模板, 发送返回 token 等信息
      await ctx.render('oauth_success.nj', { token });
      // ctx.helper.success({ ctx, res: { token } });
    } catch (error) {
      ctx.helper.error({ ctx, errorType: 'giteeOauthFail' });
    }
  }

  async getUserInfo() {
    const { ctx, service } = this;
    const userData = await service.user.findByUsername(ctx.state.user.username);
    ctx.helper.success({ ctx, res: userData });
  }
}
