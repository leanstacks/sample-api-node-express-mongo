import { ObjectId } from 'mongodb';
import { Schema, model } from 'mongoose';
import toJSON from './plugins/toJSON';

export interface IAccount {
  id?: ObjectId | string;
  username: string;
  password: string;
}

const accountSchema = new Schema<IAccount>({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true, private: true },
});

accountSchema.plugin(toJSON);
const Account = model<IAccount>('Account', accountSchema);

export default Account;
