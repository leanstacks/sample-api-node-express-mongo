import { Schema, model } from 'mongoose';

export interface IAccount {
  username: string;
  password: string;
}

const accountSchema = new Schema<IAccount>({
  username: { type: String, required: true },
  password: { type: String, required: true },
});

const Account = model<IAccount>('Account', accountSchema);

export default Account;
