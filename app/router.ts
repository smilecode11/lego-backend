import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;
  const jwtMiddleware = app.jwt as any;

  //  指定 prefix, 设置路由前缀
  router.prefix('/api');

  router.post('/users/create', controller.user.createByEmail);
  router.post('/users/loginByEmail', controller.user.loginByEmail);
  router.post('/users/getVeriCode', controller.user.getVeriCode);
  router.post('/users/loginByCellphone', controller.user.loginByCellphone);
  router.get('/users/passport/gitee', controller.user.oauth);
  router.get('/users/passport/gitee/callback', controller.user.oauthByGitee);
  router.get('/users/getUserInfo', jwtMiddleware, controller.user.getUserInfo);
  router.patch('/users/updateUserInfo', jwtMiddleware, controller.user.updateUserInfo); //  用户更新
  router.delete('/users/:id', jwtMiddleware, controller.user.deleteUser); //  用户删除 status - 1 正常用户 - 0 删除用户

  router.get('/templates', controller.work.templateList); //  查询模板列表 - 作品: isTemplate - true
  router.get('/templates/:id', controller.work.getTemplateById); //  获取单个模板
  router.get('/works/:id', controller.work.getWorkById); //  获取单个作品
  router.post('/works', jwtMiddleware, controller.work.createWork); //  创建作品
  router.get('/works', jwtMiddleware, controller.work.myList); //  查询我的作品列表
  router.patch('/works/:id', jwtMiddleware, controller.work.update); //  修改作品
  router.delete('/works/:id', jwtMiddleware, controller.work.delete); //  删除作品
  router.post('/publish/:id', jwtMiddleware, controller.work.publish); //  发布作品
  router.post('/publish-template/:id', jwtMiddleware, controller.work.publishTemplate); //  发布模板
  router.post('/works/copy/:id', jwtMiddleware, controller.work.copyWork); //  复制作品

  router.post('/channels', jwtMiddleware, controller.work.createChannel); //  给 work 添加 channel
  router.get('/channels/:id', jwtMiddleware, controller.work.getWorkChannels); //  获取 work 的 channels
  router.patch('/channels/:id', jwtMiddleware, controller.work.updateWorkChannel);
  router.delete('/channels/:id', jwtMiddleware, controller.work.deleteWorkChannel);

  router.post('/upload-img', jwtMiddleware, controller.utils.uploadMutipleFilesToOSS);
  router.get('/pages/:idAndUuid', controller.utils.renderH5Page);
};

