import jwt from 'jsonwebtoken';

import config from '../config/config';
import logger from '../utils/logger';

const createToken = (payload: object, options?: jwt.SignOptions): string => {
  logger.debug('JwtService::createToken');
  const defaultOptions: jwt.SignOptions = {
    algorithm: 'HS256',
    expiresIn: config.JWT_ACCESS_TOKEN_EXPIRES_IN,
    audience: config.JWT_AUDIENCE,
    issuer: config.JWT_ISSUER,
  };

  const signOptions = Object.assign(defaultOptions, options);

  return jwt.sign(payload, config.JWT_SECRET, signOptions);
};

const verifyToken = (token: string, options?: jwt.VerifyOptions): jwt.JwtPayload => {
  logger.debug('JwtService::verifyToken');
  const defaultOptions: jwt.VerifyOptions = {
    algorithms: ['HS256'],
    audience: config.JWT_AUDIENCE,
    issuer: config.JWT_ISSUER,
    maxAge: config.JWT_ACCESS_TOKEN_EXPIRES_IN,
  };

  const verifyOptions = Object.assign(defaultOptions, options);

  return jwt.verify(token, config.JWT_SECRET, verifyOptions) as jwt.JwtPayload;
};

export default {
  createToken,
  verifyToken,
};
