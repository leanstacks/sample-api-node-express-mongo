import passport, { AuthenticateOptions } from 'passport';
import { BasicStrategy, BasicVerifyFunction } from 'passport-http';

import { logger } from '../utils/logger';

const CLIENT_ID = 'clientId';
const CLIENT_SECRET = 'clientSecret';

const verify: BasicVerifyFunction = (username, password, done): void => {
  try {
    if (username === CLIENT_ID && password === CLIENT_SECRET) {
      const user = {
        name: username,
        isAuthorized: true,
        role: 'client',
      };
      return done(null, user);
    } else {
      return done(null, false);
    }
  } catch (err) {
    return done(err);
  }
};

export const strategyBasic: BasicStrategy = new BasicStrategy(verify);

const authenticateOptions: AuthenticateOptions = {
  session: false,
};

export const authenticatorBasic: passport.Authenticator = passport.authenticate('basic', authenticateOptions);
