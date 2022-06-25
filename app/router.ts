import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;
  router.get('/', controller.home.index);
  const jwtMiddleware = app.jwt as any;

  router.post('/api/users/create', controller.user.createByEmail);
  router.post('/api/users/loginByEmail', controller.user.loginByEmail);
  router.post('/api/users/getVeriCode', controller.user.getVeriCode);
  router.post('/api/users/loginByCellphone', controller.user.loginByCellphone);
  router.get('/api/users/passport/gitee', controller.user.oauth);
  router.get('/api/users/passport/gitee/callback', controller.user.oauthByGitee);
  router.get('/api/users/getUserInfo', jwtMiddleware, controller.user.getUserInfo);

  //  作品
  router.post('/api/works', jwtMiddleware, controller.work.createWork);
};

