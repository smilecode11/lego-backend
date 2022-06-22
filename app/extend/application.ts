/** 扩展 application */
import { Application } from 'egg';
import axios, { AxiosInstance } from 'axios';
import Dysmsapi from '@alicloud/dysmsapi20170525';
import * as $OpenApi from '@alicloud/openapi-client';

const AXIOS = Symbol('Application#axios');
const ALCLIENT = Symbol('Application#ALClient');

export default {
  // 方法扩展
  echo(msg: string) {
    const _self = this as unknown as Application;
    return `hello${msg}${_self.config.name}`;
  },
  //  属性扩展
  get axiosInstance(): AxiosInstance {
    if (!this[AXIOS]) {
      this[AXIOS] = axios.create({
        baseURL: 'https://dog.ceo/',
        timeout: 5000,
      });
    }
    return this[AXIOS];
  },

  //  Application 扩展 aliClient 实例
  get ALClient(): Dysmsapi {
    const _self = this as Application;
    const { accessKeyId, accessKeySecret, endpoint } = _self.config.aliCloudConfig;
    if (!this[ALCLIENT]) {
      const config = new $OpenApi.Config({
        accessKeyId,
        accessKeySecret,
      });
      config.endpoint = endpoint;
      this[ALCLIENT] = new Dysmsapi(config);
    }
    return this[ALCLIENT];
  },
};
