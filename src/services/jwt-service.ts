import jwt from 'jsonwebtoken';

import config from '../config/config';
import { logger } from '../utils/logger';

export default class JwtService {
  algorithm = 'HS256';
  audience: string;
  expiresInSeconds: string;
  issuer: string;

  constructor() {
    this.audience = config.JWT_AUDIENCE;
    this.expiresInSeconds = config.JWT_EXPIRES_IN;
    this.issuer = config.JWT_ISSUER;
  }

  createAccessToken = (payload: object): string => {
    logger.info('JwtService::createAccessToken');
    const options: jwt.SignOptions = {
      algorithm: 'HS256',
      expiresIn: this.expiresInSeconds,
      audience: this.audience,
      issuer: this.issuer,
    };
    return jwt.sign(payload, config.JWT_SECRET, options);
  };

  verifyToken = (token: string): jwt.JwtPayload => {
    logger.info('JwtService::verify');
    const options: jwt.VerifyOptions = {
      algorithms: ['HS256'],
      audience: config.JWT_AUDIENCE,
      issuer: config.JWT_ISSUER,
      maxAge: config.JWT_EXPIRES_IN,
    };
    return jwt.verify(token, config.JWT_SECRET, options) as jwt.JwtPayload;
  };
}
