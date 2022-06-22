import { Service } from 'egg';
import { UserProps } from '../model/user';
import * as $Dysmsapi20170525 from '@alicloud/dysmsapi20170525';

export default class UserService extends Service {
  /** 通过邮箱创建用户*/
  async createByEmail(payload: UserProps) {
    const { ctx } = this;
    const { username, password } = payload;
    const passwordHash = await ctx.genHash(password);
    const userCreateData: Partial<UserProps> = {
      username,
      password: passwordHash,
      email: username,
    };
    return ctx.model.User.create(userCreateData);
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
      const token = app.jwt.sign({ username: user.username }, app.config.jwt.secret);
      return token;
    }
    //  新建用户注册返回 -> token
    const userCreatedData: Partial<UserProps> = {
      username: cellphone,
      phoneNumber: cellphone,
      nickName: `乐高${cellphone.slice(-4)}`,
      type: 'cellphone',
    };
    const newUser = await ctx.model.User.create(userCreatedData);
    const token = app.jwt.sign({ username: newUser.username }, app.config.jwt.secret);
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
}
