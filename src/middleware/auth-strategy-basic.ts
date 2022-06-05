import { BasicStrategy, BasicVerifyFunction } from 'passport-http';

import AccountService from '../services/account-service';

export const verify: BasicVerifyFunction = async (username, password, done): Promise<void> => {
  try {
    const account = await AccountService.authenticate(username, password);
    if (account) {
      return done(null, account);
    } else {
      return done(null, false);
    }
  } catch (err) {
    return done(err);
  }
};

export const strategyBasic: BasicStrategy = new BasicStrategy(verify);
