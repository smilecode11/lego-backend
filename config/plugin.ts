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
};

export default plugin;
