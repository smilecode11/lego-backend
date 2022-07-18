import { EggAppConfig, PowerPartial } from 'egg';

export default () => {
  const config: PowerPartial<EggAppConfig> = {};
  config.baseUrl = 'http://127.0.0.1:7001';
  config.mongoose = {
    url: 'mongodb://lego-mongo:27017/lego',
    options: {
      user: process.env.MONGO_DB_USERNAME,
      pass: process.env.MONGO_DB_PASSWORD,
    },
  };
  config.redis = {
    client: {
      port: 6379,
      host: 'lego-redis',
      password: process.env.REDIS_PASSWORD,
      db: 0,
    },
  };

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
