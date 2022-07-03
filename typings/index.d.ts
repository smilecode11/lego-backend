import 'egg';
import { Condition, Model } from 'mongoose';
import { UserProps } from '../app/model/user'
import * as OSS from 'ali-oss';
import { Options } from 'ali-oss'
declare module 'egg' {
    interface MongooseModels extends IModel {
        // User: Model<UserProps>
        [key: string]: Model<any>
    }

    interface Application {
        mongoose: Condition
        model: MongooseModels
        sessionMap: {
            [key: string]: any
        }
        sessionStore: any
    }

    interface Context {
        //  egg-bcrypt 插件方法类型定义
        genHash(plaintext: string): Promise<string>,
        compare(plaintext: string, hash: string): Promise<boolean>,
        //  添加 oss 声明
        oss: OSS
    }

    interface EggAppConfig {
        //  egg-bcrypt 插件配置属性类型定义
        bcrypt: {
            saltRounds: number
        };
        oss: {
            client?: Options
        }
    }
}