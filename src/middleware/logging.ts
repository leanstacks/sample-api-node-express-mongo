import morgan from 'morgan';

import config from '../config/config';
import logger from '../utils/logger';

const stream = {
  write: (message: string) => logger.info(message),
};

const skip = () => {
  const env = config.NODE_ENV || 'development';
  return env !== 'development';
};

export const loggingMiddleware = morgan(':method :url :status :res[content-length] - :response-time ms', {
  stream,
  skip,
});
