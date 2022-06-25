import { Schema, model, Types, Model } from 'mongoose';
import bcrypt from 'bcrypt';
import find from 'lodash/find';
import orderBy from 'lodash/orderBy';
import take from 'lodash/take';
import takeRight from 'lodash/takeRight';
import toJSON from './plugins/toJSON';
import config from '../config/config';
import dayjs, { Dayjs } from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
dayjs.extend(isSameOrBefore);

interface IPasswordHistory {
  _id: Types.ObjectId;
  password: string;
  changedAt: Date;
}

const passwordHistorySchema = new Schema<IPasswordHistory>({
  password: { type: String, required: true },
  changedAt: { type: Date, required: true },
});

export interface IAccount {
  id?: Types.ObjectId | string;
  username: string;
  password: string;
  isActive: boolean;
  isLocked: boolean;
  passwordChangedAt?: Date;
  lastAuthenticatedAt?: Date;
  invalidAuthenticationCount: number;
  passwordHistory: IPasswordHistory[];
}

interface IAccountQueryHelpers {}

type IAccountMethodsAndOverrides = {
  isPasswordMatch(value: string): boolean;
  isPasswordReused(password: string): boolean;
  passwordHistory: Types.DocumentArray<IPasswordHistory>;
};

type AccountModel = Model<IAccount, IAccountQueryHelpers, IAccountMethodsAndOverrides>;

const accountSchema = new Schema<IAccount, AccountModel, IAccountMethodsAndOverrides>(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true, private: true },
    isActive: { type: Boolean, default: true },
    isLocked: { type: Boolean, default: false },
    passwordChangedAt: { type: Date },
    lastAuthenticatedAt: { type: Date },
    invalidAuthenticationCount: { type: Number, default: 0 },
    passwordHistory: { type: [passwordHistorySchema], private: true },
  },
  {
    toJSON: { virtuals: true },
  },
);

accountSchema.method(
  'isPasswordMatch',
  async function isPasswordMatch(value: string): Promise<boolean> {
    return bcrypt.compare(value, this.password);
  },
);

accountSchema.method('isPasswordReused', function isPasswordReused(password: string): boolean {
  const recentPasswords = take(
    orderBy(this.passwordHistory, ['changedAt'], ['desc']),
    config.AUTH_PASSWORD_REUSE_COUNT,
  );
  const passwordMatch = find(recentPasswords, (recentPassword) => {
    return bcrypt.compareSync(password, recentPassword.password);
  });
  return !!passwordMatch;
});

accountSchema.virtual('isPasswordExpired').get(function () {
  const lastChanged: Dayjs = dayjs(this.passwordChangedAt);
  const now: Dayjs = dayjs();
  return lastChanged.add(config.AUTH_PASSWORD_EXPIRES_IN_DAYS, 'day').isSameOrBefore(now);
});

accountSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const password = await bcrypt.hash(this.password, 10);
    const now = new Date();
    this.password = password;
    this.passwordChangedAt = now;
    this.passwordHistory.push({ password, changedAt: now });
  }
  next();
});

accountSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    // manage password history
    const expireCount = this.passwordHistory.length - config.AUTH_PASSWORD_HISTORY_COUNT;
    if (expireCount > 0) {
      const expiredPasswordHistory = takeRight(
        orderBy(this.passwordHistory, ['changedAt'], ['desc']),
        expireCount,
      );
      expiredPasswordHistory.forEach(async (passwordHistory) => {
        await passwordHistory.remove();
      });
    }
  }
  next();
});

accountSchema.plugin(toJSON);
const Account = model<IAccount, AccountModel>('Account', accountSchema);

export default Account;
