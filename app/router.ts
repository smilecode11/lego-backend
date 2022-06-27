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

  router.get('/api/templates', controller.work.templateList); //  查询模板列表 - 作品
  router.post('/api/works', jwtMiddleware, controller.work.createWork); //  创建作品
  router.get('/api/works', jwtMiddleware, controller.work.myList); //  查询我的作品列表
  router.patch('/api/works/:id', jwtMiddleware, controller.work.update); //  修改作品
  router.delete('/api/works/:id', jwtMiddleware, controller.work.delete); //  删除作品
  router.post('/api/publish/:id', jwtMiddleware, controller.work.publish); //  发布作品
  router.post('/api/publish-template/:id', jwtMiddleware, controller.work.publishTemplate); //  发布模板
};

