import { VerifyOptions } from 'jsonwebtoken';
import { ExtractJwt, Strategy, StrategyOptions, VerifyCallback } from 'passport-jwt';

import config from '../config/config';
import { logger } from '../utils/logger';

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
    logger.info(`JWT payload`, { payload });
    const user = {
      name: 'Json Token',
      role: 'bearer',
    };
    return done(null, user);
  } catch (err) {
    return done(err);
  }
};

export const strategyJwt: Strategy = new Strategy(options, verify);
