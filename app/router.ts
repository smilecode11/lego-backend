import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;

  router.get('/', controller.home.index);

  router.post('/api/users/create', controller.user.createByEmail);
  router.post('/api/users/login', controller.user.loginByEmail);
  router.get('/api/users/current', controller.user.current);
};

