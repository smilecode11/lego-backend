/** 扩展 application */
import { Application } from 'egg';
import axios, { AxiosInstance } from 'axios';
const AXIOS = Symbol('Application#axios');

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
};
