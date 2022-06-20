import { Schema, model, Types, Model } from 'mongoose';
import bcrypt from 'bcrypt';
import toJSON from './plugins/toJSON';

export interface IAccount {
  id?: Types.ObjectId | string;
  username: string;
  password: string;
  isActive: boolean;
  isLocked: boolean;
  passwordChangedAt?: Date;
  lastAuthenticatedAt?: Date;
}

interface IAccountQueryHelpers {}

interface IAccountMethods {
  isPasswordMatch(value: string): boolean;
}

type AccountModel = Model<IAccount, IAccountQueryHelpers, IAccountMethods>;

const accountSchema = new Schema<IAccount, AccountModel, IAccountMethods>({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true, private: true },
  isActive: { type: Boolean, required: true },
  isLocked: { type: Boolean, required: true },
  passwordChangedAt: { type: Date },
  lastAuthenticatedAt: { type: Date },
});
accountSchema.method(
  'isPasswordMatch',
  async function isPasswordMatch(value: string): Promise<boolean> {
    return bcrypt.compare(value, this.password);
  },
);

accountSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
    this.passwordChangedAt = new Date();
  }
  next();
});

accountSchema.plugin(toJSON);
const Account = model<IAccount, AccountModel>('Account', accountSchema);

export default Account;
