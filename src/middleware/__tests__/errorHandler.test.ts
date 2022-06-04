import { Request, Response } from 'express';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

import { AccountExistsError } from '../../services/account-service';
import { errorHandler } from '../errors';

describe('errorHandler middleware', () => {
  const next = jest.fn();
  const req: Request = {} as Request;
  const res: Response = {} as Response;
  const status = jest.fn();
  const send = jest.fn();
  const end = jest.fn();
  res.status = status;
  res.send = send;
  res.end = end;

  beforeEach(() => {
    next.mockClear();
    status.mockClear();
    send.mockClear();
    end.mockClear();
  });

  it('should return status code 500 by default', () => {
    const error = new Error('default error');

    errorHandler(error, req, res, next);

    expect(status).toHaveBeenLastCalledWith(500);
    expect(end).toHaveBeenCalled();
  });

  it('should return status code 422 for ValidationError', () => {
    const error = new Error('validation error');
    error.name = 'ValidationError';

    errorHandler(error, req, res, next);

    expect(status).toHaveBeenLastCalledWith(422);
    expect(send).toHaveBeenCalledWith({ message: 'validation error' });
  });

  it('should return status code 400 for TokenExpiredError', () => {
    const error = new TokenExpiredError('token expired error', new Date());

    errorHandler(error, req, res, next);

    expect(status).toHaveBeenLastCalledWith(400);
    expect(send).toHaveBeenCalledWith({ message: 'token expired' });
  });

  it('should return status code 400 for JsonWebTokenError', () => {
    const error = new JsonWebTokenError('token  error');

    errorHandler(error, req, res, next);

    expect(status).toHaveBeenLastCalledWith(400);
    expect(send).toHaveBeenCalledWith({ message: 'token invalid' });
  });

  it('should return status code 409 for AccountExistsError', () => {
    const error = new AccountExistsError('username in use');

    errorHandler(error, req, res, next);

    expect(status).toHaveBeenLastCalledWith(409);
    expect(send).toHaveBeenCalledWith({ message: 'account exists' });
  });

  it('should call next if error occurs', () => {
    const error = new Error('default error');
    const throwMe = new Error('test error');
    status.mockImplementation(() => {
      throw throwMe;
    });

    errorHandler(error, req, res, next);

    expect(next).toHaveBeenCalledWith(throwMe);
  });
});
