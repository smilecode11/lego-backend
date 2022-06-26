import { Controller } from 'egg';
import inputValidate from '../decorator/inputValidate';

const workCreateRules = {
  title: 'string',
};
export default class WorkController extends Controller {

  /** 创建一个作品*/
  @inputValidate(workCreateRules, 'workValidateFail')
  async createWork() {
    const { ctx, service } = this;
    const workData = await service.work.createEmptyWork(ctx.request.body);
    ctx.helper.success({ ctx, res: workData });
  }
}
