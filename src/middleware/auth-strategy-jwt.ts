import { VerifyOptions } from 'jsonwebtoken';
import { ExtractJwt, Strategy, StrategyOptions, VerifyCallback } from 'passport-jwt';

import config from '../config/config';

const verifyOptions: VerifyOptions = {
  maxAge: parseInt(config.JWT_ACCESS_TOKEN_EXPIRES_IN, 10),
};

const options: StrategyOptions = {
  algorithms: ['HS256'],
  audience: config.JWT_AUDIENCE,
  issuer: config.JWT_ISSUER,
  jsonWebTokenOptions: verifyOptions,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.JWT_SECRET,
};

const verify: VerifyCallback = (payload, done) => {
  try {
    const { accountId, username } = payload;
    const user = {
      accountId,
      username,
    };
    return done(null, user);
  } catch (err) {
    return done(err);
  }
};

export const strategyJwt: Strategy = new Strategy(options, verify);
