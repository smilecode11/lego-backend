import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;

  //  在路由上配置使用中间件
  const logger = app.middleware.myLogger({
    allowedMethod: [ 'GET' ],
  }, app);

  router.get('/', controller.home.index);

  router.get('/test/:id', controller.test.index);
  router.post('/test/:id', controller.test.index);
  router.get('/dog', logger, controller.test.getDog); //  理论上在路由中可以配置使用无数个中间件
};

