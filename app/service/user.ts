import { Service } from 'egg';
import { UserProps } from '../model/user';
import * as $Dysmsapi20170525 from '@alicloud/dysmsapi20170525';

interface GiteeUserResp {
  id: number;
  login: string;
  name: string;
  avatar_url: string;
  email: string;
}

export default class UserService extends Service {
  /** 通过邮箱创建用户*/
  async createByEmail(payload: UserProps) {
    const { ctx, app } = this;
    const { username, password } = payload;
    const passwordHash = await ctx.genHash(password);
    const userCreateData: Partial<UserProps> = {
      username,
      password: passwordHash,
      email: username,
    };
    const newUser = await ctx.model.User.create(userCreateData);
    const token = app.jwt.sign({ username: newUser.username, _id: newUser._id }, app.config.jwt.secret);
    return token;
  }

  /** 阿里 SMS 短信发送服务*/
  async sendSMS(phoneNumber: string, veriCode: string) {
    const { app } = this;
    //  参数配置
    const sendSMSRequest = new $Dysmsapi20170525.SendSmsRequest({
      signName: '阿里云短信测试',
      templateCode: 'SMS_154950909',
      phoneNumbers: phoneNumber,
      templateParam: `{\"code\":\"${veriCode}\"}`,
    });
    const resp = await app.ALClient.sendSms(sendSMSRequest);
    return resp;
  }

  /** 通过手机号验证码登录*/
  async loginByCellphone(cellphone: string) {
    const { ctx, app } = this;
    const user = await this.findByUsername(cellphone);
    //  检查 user 是否存在 -> 注册/登录 -> token
    if (user) {
      const token = app.jwt.sign({ username: user.username, _id: user._id }, app.config.jwt.secret);
      return token;
    }
    //  新建用户注册返回 -> token
    const userCreatedData: Partial<UserProps> = {
      username: cellphone,
      phoneNumber: cellphone,
      nickName: `Lego${cellphone.slice(-4)}`,
      type: 'cellphone',
    };
    const newUser = await ctx.model.User.create(userCreatedData);
    const token = app.jwt.sign({ username: newUser.username, _id: newUser._id }, app.config.jwt.secret);
    return token;
  }

  /** 通过 id 查找*/
  async findById(id: string) {
    return this.ctx.model.User.findById(id);
  }

  /** 通过 username 查找用户*/
  async findByUsername(username: string) {
    return this.ctx.model.User.findOne({ username });
  }

  /** 获取 gitee access_token*/
  async getAccessToken(code: string) {
    const { ctx, app } = this;
    const { cid, secret, redirectURL, authURL } = app.config.giteeOauthConfig;
    const { data } = await ctx.curl(authURL, {
      method: 'POST',
      contentType: 'json',
      dataType: 'json',
      data: {
        code,
        client_id: cid,
        redirect_uri: redirectURL,
        client_secret: secret,
      },
    });
    return data.access_token;
  }

  /** 获取 gitee user data*/
  async getGiteeUserData(access_token: string) {
    const { ctx, app } = this;
    const { giteeUserAPI } = app.config.giteeOauthConfig;
    const { data } = await ctx.curl<GiteeUserResp>(`${giteeUserAPI}?access_token=${access_token}`, {
      dataType: 'json',
    });
    return data;
  }

  /** Gitee用户信息登录*/
  async loginByGitee(code: string) {
    const { ctx, app } = this;
    //  获取 access_token
    const access_token = await this.getAccessToken(code);
    //  获取用户信息
    const user = await this.getGiteeUserData(access_token);
    //  检查用户是否存在
    const { id, name, avatar_url, email } = user;
    const stringId = id.toString();
    const existsUser = await this.findByUsername(`Gitee${stringId}`);
    //  已存在, 返回 token
    if (existsUser) {
      const token = app.jwt.sign({ username: existsUser.username, _id: existsUser._id }, app.config.jwt.secret);
      return token;
    }
    //  不存在, 新建用户, 返回 token
    const userCreatedData: Partial<UserProps> = {
      oauthID: stringId,
      provider: 'gitee',
      username: `Gitee${stringId}`,
      picture: avatar_url,
      nickName: name,
      email,
      type: 'oauth',
    };
    const newUser = await ctx.model.User.create(userCreatedData);
    const token = app.jwt.sign({ username: newUser.username, _id: newUser._id }, app.config.jwt.secret);
    return token;
  }
}
