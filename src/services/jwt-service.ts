import jwt from 'jsonwebtoken';

import config from '../config/config';
import { logger } from '../utils/logger';

export default class JwtService {
  accessTokenExpiresIn: string;
  algorithm = 'HS256';
  audience: string;
  issuer: string;
  refreshTokenExpiresIn: string;

  constructor() {
    this.audience = config.JWT_AUDIENCE;
    this.accessTokenExpiresIn = config.JWT_ACCESS_TOKEN_EXPIRES_IN;
    this.issuer = config.JWT_ISSUER;
    this.refreshTokenExpiresIn = config.JWT_REFRESH_TOKEN_EXPIRES_IN;
  }

  createToken = (payload: object, options?: jwt.SignOptions): string => {
    logger.info('JwtService::createToken');
    const defaultOptions: jwt.SignOptions = {
      algorithm: 'HS256',
      expiresIn: this.accessTokenExpiresIn,
      audience: this.audience,
      issuer: this.issuer,
    };

    const signOptions = Object.assign(defaultOptions, options);

    return jwt.sign(payload, config.JWT_SECRET, signOptions);
  };

  verifyToken = (token: string, options?: jwt.VerifyOptions): jwt.JwtPayload => {
    logger.info('JwtService::verifyToken');
    const defaultOptions: jwt.VerifyOptions = {
      algorithms: ['HS256'],
      audience: this.audience,
      issuer: this.issuer,
      maxAge: this.accessTokenExpiresIn,
    };

    const verifyOptions = Object.assign(defaultOptions, options);

    return jwt.verify(token, config.JWT_SECRET, verifyOptions) as jwt.JwtPayload;
  };
}
