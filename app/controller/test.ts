import { Controller } from 'egg';

export default class TestContainer extends Controller {
  async index() {
    const { ctx } = this;
    const { query, body } = ctx.request; //  ctx.query
    const { id } = ctx.params; //   获取 params
    const { baseUrl } = ctx.app.config;
    const message = this.app.echo('扩展 app echo 方法');
    const dogData = await this.app.axiosInstance.get('/api/breeds/image/random');
    const ctxExtendFunc = ctx.$echo('smiling.')
    const ctxExtendAttr = ctx.Instance
    ctx.logger.debug('debug info')
    ctx.logger.info('res data', dogData.data)
    ctx.logger.warn('res data', dogData.data)
    ctx.logger.error(new Error('whoop'))
    const resp = {
      query,
      id,
      body,
      baseUrl,
      message,
      dogData: dogData.data,
      ctxExtendFunc,
      ctxExtendAttr
    };
    ctx.helper.success({ ctx, res: resp });
  }

  async getDog() {
    const { service, ctx } = this;
    const resp = await service.dog.show();
    await ctx.render('test.nj', { url: resp.message });
  }
}
