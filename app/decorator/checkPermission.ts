import { Controller } from 'egg';
import { subject } from '@casl/ability';
import { permittedFieldsOf } from '@casl/ability/extra';
import { GlobalErrorTypes } from '../error';
import { defineRules } from '../roles/roles';
import { difference } from 'lodash';
import { assign } from 'lodash/fp'; //  从 loadash/fp 下获取的方法, 是不会修改源数据的

const caslMethodMapping: Record<string, string> = {
  GET: 'read',
  POST: 'create',
  PATCH: 'update',
  DELETE: 'delete',
};

const fieldsOptions = { fieldsFrom: rule => rule.fields || [] };

interface IOptions {
  action?: string;
  key?: string;
  value?: { type: 'params' | 'body', valueKey: string };
}
//  创建作品传入的是 wordId(即 valueKey 需要做兼容, 且可能来自 body 或者 params)
//  更新作品的时候, 查询 key 是 channels.id(即 key 要做兼容)
//  { id: ctx.params.id }
//  { 'channel.id': ctx.params.id }
//  { id: ctx.request.body.workId}

const defaultSearchOptions: IOptions = {
  key: 'id',
  value: { type: 'params', valueKey: 'id' },
};

//  用于 casl 和 mongoose 的 modelName, 如 Channel 是 casl 定义的 modelName, 查询目标的 mongoose modeName 是 Work
interface ModelMapping {
  mongoose: string;
  casl: string;
}

/**
 * @param modelName model 的名称, 可以使普通的字符串, 也可以是 casl 和 mongoose 的映射关系
 * @param errorType 返回的错误类型, 来自 GlobalErrorTypes
 * @param options 特殊配置选项, 可以自定义 action 以及查询条件, 详见 IOptions
 * @return function
 */
export default function checkPermission(modelName: string | ModelMapping, errorType: GlobalErrorTypes, options?: IOptions) {
  return function (prototype, key: string, descriptor: PropertyDescriptor) {
    const originMethod = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      const _self = this as Controller;
      // eslint-disable-next-line
      // @ts-ignore
      const { ctx } = _self;
      const { method } = ctx.request;
      const searchOptions = assign(defaultSearchOptions, options || {});
      const { key, value } = searchOptions as Required<IOptions>;
      const { type, valueKey } = value;
      //  构建一个 query
      const source = (type === 'params') ? ctx.params : ctx.request.body;
      const query = {
        [key as string]: source[valueKey],
      };
      //  构建 modelName
      const mongooseModelName = typeof modelName === 'string' ? modelName : modelName.mongoose;
      const caslModelName = typeof modelName === 'string' ? modelName : modelName.casl;
      //  若存在自定义的 action, 则直接使用自定义的 action, 不再使用 caslMethodMapping 中的 action
      const action = options && options.action ? options.action : caslMethodMapping[method];
      if (!ctx.stale && !ctx.state.user) {
        return ctx.helper.error({ ctx, errorType });
      }
      let permission = false;
      let keysPermission = true;
      //  获取定义的 roles
      const ability = defineRules(ctx.state.user);
      //  获取 rule 来判断, 看他是否存在对应的条件
      const rule = ability.relevantRuleFor(action, caslModelName);
      if (rule && rule.conditions) {
        //  如果当前 rule 有条件, 则查询对应的数据
        const certianRecord = await ctx.model[mongooseModelName].findOne(query).lean();
        permission = ability.can(action, subject(caslModelName, certianRecord));
      } else {
        permission = ability.can(action, caslModelName);
      }
      //  判断 rule 中是否有对应的受限字段
      if (rule && rule.fields) {
        const fields = permittedFieldsOf(ability, action, caslModelName, fieldsOptions);
        if (fields.length > 0) {
          //  1. 通过过滤 request.body, 将可操作的值进行更新 *
          //  2. 通过对比 payload 的 key 和可被允许的 filed 作比较
          const payloadKeys = Object.keys(ctx.request.body);
          const diffKeys = difference(payloadKeys, fields);
          keysPermission = diffKeys.length === 0;
        }
      }
      if (!permission || !keysPermission) {
        return ctx.helper.error({ ctx, errorType });
      }
      await originMethod.apply(this, args);
    };
  };
}
