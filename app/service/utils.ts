import { Service } from 'egg';
import { createSSRApp } from 'vue';
import { renderToString } from '@vue/server-renderer';
import LegoComponents from 'lego-components';

export default class UtilsService extends Service {
  //  body props 转换成 style
  propsToStyle(props = {}) {
    const keys = Object.keys(props);
    const styleArr = keys.map(key => {
      const formatKey = key.replace(/[A-Z]/g, c => `-${c.toLocaleLowerCase()}`);
      const value = props[key];
      return `${formatKey}: ${value}`;
    });
    return styleArr.join(';');
  }

  /** px2Vw*/
  pxToVw(components = []) {
    const reg = /^(\d+(\.\d+)?)px$/g; //  匹配 13px 12.5px 等
    components.forEach((component: any = {}) => {
      const props = component.props || {};
      Object.keys(props).forEach(key => {
        const val = props[key];
        if (typeof val !== 'string') return; //  排除值错误
        if (reg.test(val) === false) return; //  排除非距离属性
        const arr = val.match(reg) || [];
        const numStr = arr[0]; //  拿到数字字符串部分
        const num = parseFloat(numStr);
        //  计算 vm, 重新赋值: 画布宽度是 375
        const vmNum = num / 375 * 100;
        props[key] = `${vmNum.toFixed(2)}vw`;
        this.app.logger.info(key, arr, numStr, props[key]);
      });
    });
  }

  /** 获取作品, 返回字符串 html, 标题, 描述*/
  async renderToPageData(query: { id: string, uuid: string }) {
    const work = await this.ctx.model.Work.findOne(query as any).lean();
    if (!work) {
      throw new Error('work not exsit');
    }
    const { title, desc, content } = work;
    const bodyStyle = this.propsToStyle({ ...(content && content.props) });
    this.pxToVw(content && content.components);
    const vueApp = createSSRApp({
      data: () => {
        return {
          components: (content && content.components) || [],
        };
      },
      template: '<final-page :components="components"></final-page>',
    });
    vueApp.use(LegoComponents);
    const html = await renderToString(vueApp);
    return {
      html,
      title,
      desc,
      bodyStyle,
    };
  }
}

