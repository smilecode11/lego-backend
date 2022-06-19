import { Service } from 'egg';
import { UserProps } from '../model/user';
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

  /** 通过 id 查找*/
  async findById(id: string) {
    return this.ctx.model.User.findById(id);
  }

  /** 通过 username 查找用户*/
  async findByUsername(username: string) {
    return this.ctx.model.User.findOne({ username });
  }
}
