import 'egg';
import { Condition, Model } from 'mongoose';
import { UserProps } from '../app/model/user'
declare module 'egg' {
    interface MongooseModels extends IModel {
        // User: Model<UserProps>
        [key: string]: Model<any>
    }

    interface Application {
        mongoose: Condition,
        model: MongooseModels
    }
}