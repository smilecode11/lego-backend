import { IBoot, Application } from 'egg';
export default class AppBoot implements IBoot {
  private readonly app: Application;
  constructor(app: Application) {
    this.app = app;
    // app.sessionMap = {};
    // app.sessionStore = {
    //   async get(key) {
    //     return app.sessionMap[key];
    //   },
    //   async set(key, value) {
    //     app.sessionMap[key] = value;
    //   },
    //   async destroy(key) {
    //     delete app.sessionMap[key];
    //   },
    // };
  }

  configWillLoad() {
    //  此时 config 文件已经被读取, 但是未生效
    //  * 这是应用修改配置的最后时机
    // this.app.config.coreMiddleware.push('customeError');
  }

  //  插件启动完毕
  async willReady() {
    //
  }

  //  应用已经启动完成
  async didReady() {
    const ctx = await this.app.createAnonymousContext();
    await ctx.service.test.sayHi('Smiling.');
  }
}
