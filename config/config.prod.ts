import { EggAppConfig, PowerPartial } from 'egg';

export default () => {
  const config: PowerPartial<EggAppConfig> = {};
  config.baseUrl = 'http://127.0.0.1:7001';
  config.mongoose = {
    url: 'mongodb://mongo:27017/lego', //  修改名称, 予以 docker 内部解析
  };
  // TODO: 给 mongoDB 和 redis 添加密码
  // config.mongoose = {
  //   client: {
  //     url: 'xxx',
  //     options: {
  //       dbName: 'lego',
  //       user: 'xyz',
  //       pass: 'pass',
  //     },
  //   },
  // };
  // config.redis = {
  //   client: {
  //     port: 6379,
  //     host: '127.0.0.1',
  //     password: 'pass',
  //     db: 0,
  //   },
  // };

  //  配置 cors 允许域名
  config.security = {
    domainWhiteList: ['http://47.96.11.73'],
  };

  //  修改 jwt 失效时间
  config.jwtExpires = '2 days';

  //  本地 url 替换
  config.giteeOauthConfig = {
    redirectURL: 'http://47.96.11.73:7001/api/users/passport/gitee/callback',
  };
  config.H5BaseURL = 'http://47.96.11.73:7002';

  return config;
};
