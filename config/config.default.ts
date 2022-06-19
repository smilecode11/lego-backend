import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';

export default (appInfo: EggAppInfo) => {
  const config = {} as PowerPartial<EggAppConfig>;

  //  cookie sign key
  config.keys = appInfo.name + '_1654852917232_2580';

  // 全局中间件使用
  config.middleware = [];

  config.security = {
    csrf: {
      enable: false,
    },
  };

  config.bodyParser = {
    jsonLimit: '10mb',
  };

  //  配置默认模板引擎使用插件
  config.view = {
    defaultViewEngine: 'nunjucks',
    mapping: {
      '.nj': 'nunjucks',
    },
  };

  //  配置 DEBUG 及以上会被输出
  config.logger = {
    consoleLevel: 'DEBUG', //  consnole 输出日志最低等级
    level: 'DEBUG', //  log 文件日志输出最低等级
  };

  config.mongoose = {
    url: 'mongodb://localhost:27017/lego',
  };

  const bizConfig = {
    sourceUrl: `https://github.com/eggjs/examples/tree/master/${appInfo.name}`,
    myLogger: { //  配置中间件允许 POST 方法时被使用
      allowedMethod: [ 'POST' ],
    },
    baseUrl: 'default.url',
  };

  return {
    ...config as {},
    ...bizConfig,
  };
};
