import { Ability, AbilityBuilder } from '@casl/ability';
import { Document } from 'mongoose';
import { UserProps } from '../model/user';

export function defineRules(user: UserProps & Document<any, any, UserProps>) {
  const { can, build } = new AbilityBuilder(Ability);
  if (user) {
    if (user.role === 'admin') {
      can('manage', 'all'); //  管理员拥有所有权限
    } else { // 普通用户权限
      //  users, 只能读取自己的信息, 以及更新特殊的字段
      can('read', 'User', { _id: user._id });
      can('update', 'User', ['nickName', 'picture'], { _id: user._id });
      //  works, 可以创建, 可以更新和删除自己的 work
      can('create', 'Work', ['title', 'content', 'desc', 'coverImg']);
      can('read', 'Work', { user: user._id });
      can('update', 'Work', ['title', 'content', 'desc', 'coverImg', 'status'], { user: user._id });
      can('delete', 'Work', { user: user._id });
      can('publish', 'Work', { user: user._id }); //  自定义 action -> "update" isTemplate status
      //  channels, 创建, 更新和删除自己的 channel
      can('create', 'Channel', ['name', 'workId'], { user: user._id });
      can('read', 'Channel', { user: user._id });
      can('update', 'Channel', ['name'], { user: user._id });
      can('delete', 'Channel', { user: user._id });
    }
  }

  return build();
}
