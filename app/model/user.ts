import { Application } from 'egg';
import { Schema, Model } from 'mongoose';
import * as AutoIncrementFactory from 'mongoose-sequence';

export interface UserProps {
  username: string;
  password: string;
  email?: string;
  nickName?: string;
  picture?: string;
  phoneNumber?: string;
  type: 'email' | 'cellphone' | 'oauth';
  provider?: 'gitee',
  oauthID?: string;
  createdAt: Date;
  updatedAt: Date;
  status: '1' | '2' | '0' //  1 -正常用户 0 -删除用户 2 -其他
}

function initUserModel(app: Application): Model<UserProps> {
  const AutoIncrement = AutoIncrementFactory(app.mongoose);
  const UserSchema = new Schema<UserProps>({
    username: { type: String, unique: true, required: true },
    password: { type: String },
    nickName: { type: String },
    picture: { type: String },
    email: { type: String },
    phoneNumber: { type: String },
    type: { type: String, default: 'email' },
    provider: { type: String },
    oauthID: { type: String },
    status: { type: String, default: '1' },
  }, {
    collection: 'user',
    timestamps: true, //  设置自动更新 Date 类属性
    toJSON: {
      //  查询返回结果处理
      transform(_doc, ret) {
        delete ret.password;
        delete ret.__v;
        delete ret._id;
      },
    },
  });
  //  Schema 使用插件
  UserSchema.plugin(AutoIncrement, { inc_field: 'id', id: 'users_id_counter' });

  return app.mongoose.model('User', UserSchema);
}

export default initUserModel;
