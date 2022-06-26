import { Service } from 'egg';
import { nanoid } from 'nanoid';
import { Types } from 'mongoose';
import { WorkProps } from '../model/work';
import { IndexCondition } from '../controller/work';

const defaultCondition: Required<IndexCondition> = {
  pageIndex: 0,
  pageSize: 0,
  select: '',
  populate: {},
  customSort: { createdAt: -1 },
  find: {},
};

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

  /** 获取work列表数据*/
  async getList(condition: IndexCondition) {
    const fCondition = { ...defaultCondition, ...condition };
    const { pageIndex, pageSize, select, populate, customSort, find } = fCondition;
    const skip = (pageIndex * pageSize);

    const listRes = await this.ctx.model.Work
      .find(find).select(select).populate(populate)
      .skip(skip)
      .limit(pageSize)
      .sort(customSort)
      // lean 更快内存更省
      .lean();

    const count = await this.ctx.model.Work.find(find).count();

    return {
      pageSize,
      pageIndex,
      count,
      list: listRes,
    };
  }
}
