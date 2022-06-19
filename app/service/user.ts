import { Service } from 'egg';
import { UserProps } from '../model/user';

export default class UserService extends Service {
  /** 通过邮箱创建用户*/
  public async createByEmail(payload: UserProps) {
    const { ctx } = this;
    const { username, password } = payload;
    const userCreateData: Partial<UserProps> = {
      username,
      password,
      email: username,
    };
    return ctx.model.User.create(userCreateData);
  }

  /** 通过 id 查找*/
  async findById(id: string) {
    return this.ctx.model.User.findById(id);
  }
}
