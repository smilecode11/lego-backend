import { Controller } from 'egg';
import inputValidate from '../decorator/inputValidate';
import checkPermission from '../decorator/checkPermission';
import { nanoid } from 'nanoid';

const workCreateRules = {
  title: 'string',
};

const workCreateChannelRules = {
  name: 'string',
  workId: 'string',
};

export interface IndexCondition {
  pageIndex?: number;
  pageSize?: number;
  select?: string | string[];
  populate?: { path?: string, select?: string };
  customSort?: Record<string, any>;
  find?: Record<string, any>;
}

export default class WorkController extends Controller {
  /** 创建作品的 channel*/
  @inputValidate(workCreateChannelRules, 'workValidateFail')
  async createChannel() {
    const { ctx } = this;
    const { name, workId } = ctx.request.body;
    const newChannel = {
      name,
      id: nanoid(6),
    };
    const res = await ctx.model.Work.findOneAndUpdate({ id: parseInt(workId) }, { $push: { channels: newChannel } }, { new: true });
    if (res) {
      ctx.helper.success({ ctx, res: newChannel });
    } else {
      ctx.helper.error({ ctx, errorType: 'channelOperaFail' });
    }
  }

  /** 获取作品的 channels */
  async getWorkChannels() {
    const { ctx } = this;
    const { id } = ctx.params;
    const certianWork = await ctx.model.Work.findOne({ id });
    if (certianWork) {
      const { channels } = certianWork;
      ctx.helper.success({ ctx, res: { count: channels && channels.length || 0, list: channels } });
    } else {
      ctx.helper.error({ ctx, errorType: 'channelOperaFail' });
    }
  }

  /** 更新 channel */
  async updateWorkChannel() {
    const { ctx } = this;
    const { id } = ctx.params;
    const { name } = ctx.request.body;
    await ctx.model.Work.findOneAndUpdate({ 'channels.id': id }, { $set: { 'channels.$.name': name } });
    ctx.helper.success({ ctx, res: { name } });
  }

  /** 删除 channel */
  async deleteWorkChannel() {
    const { ctx } = this;
    const { id } = ctx.params;
    const work = await ctx.model.Work.findOneAndUpdate({ 'channels.id': id }, { $pull: { channels: { id } } }, { new: true });
    ctx.helper.success({ ctx, res: work });
  }

  /** 创建一个作品*/
  @inputValidate(workCreateRules, 'workValidateFail')
  async createWork() {
    const { ctx, service } = this;
    const workData = await service.work.createEmptyWork(ctx.request.body);
    ctx.helper.success({ ctx, res: workData });
  }

  /** 获取作品列表*/
  async myList() {
    const { ctx } = this;
    const userId = ctx.state.user._id;
    const { pageIndex, pageSize, isTemplate, title } = ctx.query;
    const findCondition = {
      user: userId,
      ...(title && { title: { $regex: title, $options: 'i' } }),
      ...(isTemplate && { isTemplate: !!parseInt(isTemplate) }),
    };
    const listCondition: IndexCondition = {
      select: 'id author copiedCount coverImg desc title user isHot createdAt',
      populate: { path: 'user', select: 'username nickName picture' },
      find: findCondition,
      ...(pageSize && { pageSize: parseInt(pageSize) }),
      ...(pageIndex && { pageIndex: parseInt(pageIndex) }),
    };
    const res = await ctx.service.work.getList(listCondition);
    ctx.helper.success({ ctx, res });
  }

  /** 获取单个作品*/
  async getWorkById() {
    const { ctx } = this;
    const work = await ctx.model.Work.findOne({ id: ctx.params.id }).populate({ path: 'user', select: 'username nickName picture' });
    if (!work) {
      return ctx.helper.error({ ctx, errorType: 'noExistsWorkFail' });
    }
    return ctx.helper.success({ ctx, res: work });
  }

  /** 获取模板列表*/
  async templateList() {
    const { ctx } = this;
    const { pageIndex, pageSize, title } = ctx.query;
    const listCondition: IndexCondition = {
      select: 'id author copiedCount coverImg desc title user isHot createdAt',
      populate: { path: 'user', select: 'username nickName picture' },
      find: {
        isPublic: true,
        isTemplate: true,
        ...(title && { title: { $regex: title, $options: 'i' } }),
      },
      ...(pageIndex && { pageIndex: parseInt(pageIndex) }),
      ...(pageSize && { pageSize: parseInt(pageSize) }),
    };
    const res = await ctx.service.work.getList(listCondition);
    ctx.helper.success({ ctx, res });
  }

  /** 获取单个模板*/
  async getTemplateById() {
    const { ctx } = this;
    const template = await ctx.model.Work.findOne({ id: ctx.params.id, isTemplate: true }).populate({
      path: 'user',
      select: 'username nickName, picture',
    });
    if (!template) {
      return ctx.helper.error({ ctx, errorType: 'noExistsTemplateFail' });
    }
    return ctx.helper.success({ ctx, res: template });
  }

  /** 更新作品*/
  @checkPermission('Work', 'workNoPermissionFail')
  async update() {
    const { ctx } = this;
    const { id } = ctx.params;
    const payload = ctx.request.body;
    //  查找并修改一条, 完成后返回新的记录
    const res = await ctx.model.Work.findOneAndUpdate({ id }, payload, { new: true }).lean();
    ctx.helper.success({ ctx, res });
  }

  /** 删除作品*/
  @checkPermission('Work', 'workNoPermissionFail')
  async delete() {
    const { ctx } = this;
    const { id } = ctx.params;
    const res = await this.ctx.model.Work.findOneAndDelete({ id }).select('_id id title').lean();
    ctx.helper.success({ ctx, res });
  }

  @checkPermission('Work', 'workNoPermissionFail')
  async publish(isTemplate: boolean) {
    const { ctx } = this;
    const url = await this.service.work.publish(ctx.params.id, isTemplate);
    ctx.helper.success({ ctx, res: { url } });
  }

  /** 发布作品*/
  async publishWork() {
    await this.publish(false);
  }

  /** 发布模板*/
  async publishTemplate() {
    await this.publish(true);
  }

  /** 复制作品*/
  async copyWork() {
    const { ctx } = this;
    const { id } = ctx.params;
    //  查找作品是否存在
    const preWork = (await ctx.model.Work.findOne({ id }))?.toObject();
    if (!preWork) {
      return ctx.helper.error({ ctx, errorType: 'noExistsWorkFail' });
    }
    delete preWork.latestPublishAt;
    delete preWork.isPublic;
    delete preWork.isTemplate;
    delete preWork.isHot;
    delete preWork._id;
    delete preWork.__v;
    delete preWork.id;
    delete preWork.status;
    preWork.copiedCount = 0;
    preWork.author = '';
    //  创建作品
    const newWork = await ctx.service.work.createEmptyWork(preWork);
    ctx.helper.success({ ctx, res: newWork });
  }
}
