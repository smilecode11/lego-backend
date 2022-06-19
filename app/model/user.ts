import { Application } from 'egg';
import { Schema, Model } from 'mongoose';

export interface UserProps {
  username: string;
  password: string;
  email?: string;
  nickName?: string;
  picture?: string;
  phoneNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

function initUserModel(app: Application) : Model<UserProps> {
  const UserSchema = new Schema<UserProps>({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    nickName: { type: String },
    picture: { type: String },
    email: { type: String },
    phoneNumber: { type: String },
  }, {
    collection: 'user',
    timestamps: true, //  设置自动更新 Date 类属性
  });

  return app.mongoose.model('User', UserSchema);
}

export default initUserModel;
