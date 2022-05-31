import jwt, { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

import JwtService from '../jwt-service';

describe('JwtService', () => {
  it('should create a token', () => {
    const service = new JwtService();
    const payload = { key: 'value' };

    const token = service.createToken(payload);
    expect(token).not.toBeNull();
    expect(typeof token).toEqual('string');
  });

  it('should successfully verify token', () => {
    const service = new JwtService();
    const payload = { key: 'value' };

    const token = service.createToken(payload);
    expect(token).not.toBeNull();

    let error = null;
    try {
      const verifiedPayload = service.verifyToken(token);
      expect(verifiedPayload).not.toBeNull();
    } catch (err: unknown) {
      error = err;
    }
    expect(error).toBeNull();
  });

  it('should return payload values', () => {
    const service = new JwtService();
    const payload = { key: 'value' };

    const token = service.createToken(payload);
    expect(token).not.toBeNull();

    const verifiedPayload = service.verifyToken(token);
    expect(verifiedPayload).not.toBeNull();
    expect(verifiedPayload.key).toEqual(payload.key);
  });

  it('should throw error when token is expired', () => {
    const service = new JwtService();
    const payload = { key: 'value' };
    const options: jwt.SignOptions = {
      expiresIn: 0,
    };

    const token = service.createToken(payload, options);
    expect(token).not.toBeNull();

    let error = null;
    try {
      service.verifyToken(token);
    } catch (err: unknown) {
      error = err;
    }
    expect(error).not.toBeNull();
    expect(error instanceof TokenExpiredError).toBeTruthy();
  });

  it('should throw error when token is invalid', () => {
    const service = new JwtService();
    const payload = { key: 'value' };
    const options: jwt.SignOptions = {
      issuer: 'SomeOtherIssuer',
    };

    const token = service.createToken(payload, options);
    expect(token).not.toBeNull();

    let error = null;
    try {
      service.verifyToken(token);
    } catch (err: unknown) {
      error = err;
    }
    expect(error).not.toBeNull();
    expect(error instanceof JsonWebTokenError).toBeTruthy();
  });
});
