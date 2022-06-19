import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;

  router.get('/', controller.home.index);

  router.post('/api/users/create', controller.user.createByEmail);
  router.get('/api/users/:id', controller.user.show);
};

