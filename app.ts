import { IBoot, Application } from 'egg';

export default class AppBoot implements IBoot {
    private readonly app: Application;
    constructor(app: Application) {
        this.app = app;
    }
    configWillLoad() {
        //  此时 config 文件已经被读取, 但是未生效
        //  * 这是应用修改配置的最后时机
        this.app.config.coreMiddleware.unshift('myLogger');
        // console.log('config', this.app.config.baseUrl);
        // console.log('enable middleware', this.app.config.coreMiddleware);
    }

    //  插件启动完毕
    async willReady() {
        // console.log('enable willready', this.app.config.coreMiddleware)
    }

    //  应用已经启动完成 
    async didReady() {
        const ctx = await this.app.createAnonymousContext()
        const res = await ctx.service.test.sayHi('smiling.')
        console.log('did ready res', res)
        // console.log('finally middleware', this.app.middleware)
    }
} 