import { EggPlugin } from 'egg';

const plugin: EggPlugin = {
  //  开启模板引擎插件
  nunjucks: {
    enable: true,
    package: 'egg-view-nunjucks',
  },

  //  启用 egg-mongoose
  mongoose: {
    enable: true,
    package: 'egg-mongoose',
  },

  validate: {
    enable: true,
    package: 'egg-validate',
  },

  bcrypt: {
    enable: true,
    package: 'egg-bcrypt',
  },
};

export default plugin;
