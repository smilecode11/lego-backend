import { Controller } from 'egg';

const workCreateRules = {
  title: 'string',
};

export const workErrorMessages = {
  workValidateFail: {
    errno: 101001,
    message: '输入信息验证失败',
  },
};

export default class WorkController extends Controller {
  private validateUserInput(rules: any) {
    const { ctx, app } = this;
    const errors = app.validator.validate(rules, ctx.request.body);
    ctx.logger.warn(errors);
    return errors;
  }

  /** 创建一个作品*/
  async createWork() {
    const { ctx, service } = this;
    const errors = this.validateUserInput(workCreateRules);
    if (errors) {
      return ctx.helper.error({ ctx, errorType: 'workValidateFail' });
    }
    const workData = await service.work.createEmptyWork(ctx.request.body);
    ctx.helper.success({ ctx, res: workData });
  }
}
