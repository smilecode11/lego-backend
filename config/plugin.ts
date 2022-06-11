import { EggPlugin } from 'egg';

const plugin: EggPlugin = {
  //  开启模板引擎插件
  nunjucks: {
    enable: true,
    package: 'egg-view-nunjucks',
  },
};

export default plugin;
