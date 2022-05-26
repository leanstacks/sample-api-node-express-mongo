import { Schema, model } from 'mongoose';
import toJSON from './plugins/toJSON';

export interface IAccount {
  username: string;
  password: string;
}

const accountSchema = new Schema<IAccount>({
  username: { type: String, required: true },
  password: { type: String, required: true, private: true },
});

accountSchema.plugin(toJSON);
const Account = model<IAccount>('Account', accountSchema);

export default Account;
