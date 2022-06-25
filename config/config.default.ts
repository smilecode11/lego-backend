import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';
import * as dotenv from 'dotenv';
dotenv.config();

export default (appInfo: EggAppInfo) => {
  const config = {} as PowerPartial<EggAppConfig>;

  //  cookie sign key
  config.keys = appInfo.name + '_1654852917232_2580';

  // 全局中间件使用
  config.middleware = [ 'customeError' ];

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
    url: 'mongodb://127.0.0.1:27017/lego',
  };

  config.validate = {
    // convert: false,
    // validateRoot: false,
  };

  config.bcrypt = {
    saltRounds: 10, //  默认加密 10 次
  };

  config.session = {
    encrypt: false,
  };

  config.jwt = {
    secret: 'smiling.jsonwebtoken95',
  };

  config.redis = {
    client: {
      port: 6379,
      host: '127.0.0.1',
      db: 0,
      password: '',
    },
  };

  config.cors = {
    origin: 'http://localhost:8080',
    allowMethods: 'GET,HEAD,PUT,OPTIONS,POST,DELETE,PATCH',
  };

  const aliCloudConfig = {
    accessKeyId: process.env.ALC_ACCESS_KEY,
    accessKeySecret: process.env.ALC_SECRET_KEY,
    endpoint: 'dysmsapi.aliyuncs.com',
  };

  const giteeOauthConfig = {
    cid: process.env.GITEE_CID,
    secret: process.env.GITEE_SECRET,
    redirectURL: 'http://127.0.0.1:7001/api/users/passport/gitee/callback',
    authURL: 'https://gitee.com/oauth/token?grant_type=authorization_code',
    giteeUserAPI: 'https://gitee.com/api/v5/user',
  };

  //  业务配置对象
  const bizConfig = {
    sourceUrl: `https://github.com/eggjs/examples/tree/master/${appInfo.name}`,
    myLogger: { //  配置中间件允许 POST 方法时被使用
      allowedMethod: [ 'POST' ],
    },
    baseUrl: 'default.url',

    //  阿里云配置
    aliCloudConfig,
    //  gitee oauth 配置
    giteeOauthConfig,
  };

  return {
    ...config as {},
    ...bizConfig,
  };
};
