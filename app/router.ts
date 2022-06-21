import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;
  router.get('/', controller.home.index);
  const jwt = app.jwt as any;

  router.post('/api/users/create', controller.user.createByEmail);
  router.post('/api/users/login', controller.user.loginByEmail);
  router.get('/api/users/current', jwt, controller.user.current);
};

