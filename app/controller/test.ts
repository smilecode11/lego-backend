import { Controller } from 'egg';
export default class TestContainer extends Controller {
  async index() {
    const { ctx } = this;
    const { query, body } = ctx.request; //  ctx.query
    const { id } = ctx.params; //   获取 params
    const { baseUrl } = ctx.app.config;
    const ctxExtendFunc = ctx.$echo('smiling.');
    const ctxExtendAttr = ctx.Instance;
    const resp = {
      query,
      id,
      body,
      baseUrl,
      ctxExtendFunc,
      ctxExtendAttr,
    };
    ctx.helper.success({ ctx, res: resp });
  }

  async getDog() {
    const { service, ctx } = this;
    const resp = await service.dog.show();
    await ctx.render('test.nj', { url: resp.message });
  }
}
