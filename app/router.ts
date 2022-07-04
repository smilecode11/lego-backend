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
  router.patch('/api/users/updateUserInfo', jwtMiddleware, controller.user.updateUserInfo); //  用户更新
  router.delete('/api/users/:id', jwtMiddleware, controller.user.deleteUser); //  用户删除 status - 1 正常用户 - 0 删除用户

  router.get('/api/templates', controller.work.templateList); //  查询模板列表 - 作品: isTemplate - true
  router.get('/api/templates/:id', controller.work.getTemplateById); //  获取单个模板
  router.get('/api/works/:id', controller.work.getWorkById); //  获取单个作品
  router.post('/api/works', jwtMiddleware, controller.work.createWork); //  创建作品
  router.get('/api/works', jwtMiddleware, controller.work.myList); //  查询我的作品列表
  router.patch('/api/works/:id', jwtMiddleware, controller.work.update); //  修改作品
  router.delete('/api/works/:id', jwtMiddleware, controller.work.delete); //  删除作品
  router.post('/api/publish/:id', jwtMiddleware, controller.work.publish); //  发布作品
  router.post('/api/publish-template/:id', jwtMiddleware, controller.work.publishTemplate); //  发布模板
  router.post('/api/works/copy/:id', jwtMiddleware, controller.work.copyWork); //  复制作品

  router.post('/uploads', controller.utils.uploadMutipleFilesToOSS);
};

