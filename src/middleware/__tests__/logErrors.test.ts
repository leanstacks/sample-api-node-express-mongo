import { NextFunction, Request, Response } from 'express';

import { logErrors } from '../errors';
import logger from '../../utils/logger';

jest.mock('../../utils/logger');
const mockedLogger = jest.mocked(logger);

describe('logErrors middleware', () => {
  it('should log the error', () => {
    const error = new Error('test error');
    const req: Request = {} as Request;
    const res: Response = {} as Response;
    const next: NextFunction = jest.fn();

    logErrors(error, req, res, next);

    expect(mockedLogger.error).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(error);
  });
});
