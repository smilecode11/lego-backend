import { Service } from 'egg';
import { nanoid } from 'nanoid';
import { Types } from 'mongoose';
import { WorkProps } from '../model/work';

export default class WorkService extends Service {
  /** 创建一个空白作品*/
  async createEmptyWork(payload) {
    const { ctx } = this;
    //  获取对应的 user id, 从 jwt 中拿
    const { username, _id } = ctx.state.user;
    //  生成一个独一无二的 URLid
    const uuid = nanoid(6);
    const newEmptyWork: Partial<WorkProps> = {
      ...payload,
      user: Types.ObjectId(_id),
      author: username,
      uuid,
    };
    return ctx.model.Work.create(newEmptyWork);
  }
}
