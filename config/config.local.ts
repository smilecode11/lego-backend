import { EggAppConfig, PowerPartial } from 'egg';

export default () => {
  const config: PowerPartial<EggAppConfig> = {};
  config.baseUrl = 'http://127.0.0.1:7001';
  config.mongoose = {
    url: 'mongodb://mongo:27017/lego', //  修改名称, 予以 docker 内部解析
  };
  return config;
};
