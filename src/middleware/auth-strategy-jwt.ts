import { VerifyOptions } from 'jsonwebtoken';
import { ExtractJwt, Strategy, StrategyOptions, VerifyCallback } from 'passport-jwt';

import AccountService from '../services/account-service';

import config from '../config/config';

const verifyOptions: VerifyOptions = {
  maxAge: config.JWT_ACCESS_TOKEN_EXPIRES_IN,
};

const options: StrategyOptions = {
  algorithms: ['HS256'],
  audience: config.JWT_AUDIENCE,
  issuer: config.JWT_ISSUER,
  jsonWebTokenOptions: verifyOptions,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.JWT_SECRET,
};

const verify: VerifyCallback = async (payload, done) => {
  try {
    const accountService = new AccountService();
    const account = await accountService.findOne(payload?.account?.id);

    if (account) {
      return done(null, account);
    } else {
      return done(null, false);
    }
  } catch (err: unknown) {
    return done(err);
  }
};

export const strategyJwt: Strategy = new Strategy(options, verify);
