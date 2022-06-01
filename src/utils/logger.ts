import { createLogger, format, LoggerOptions, transports } from 'winston';

import config from '../config/config';

const levels = {
  fatal: 0,
  error: 1,
  info: 2,
  debug: 3,
  verbose: 4,
};

const loggerOptions: LoggerOptions = {
  level: 'info',
  levels,
  format: format.combine(format.timestamp(), format.json()),
  defaultMeta: { service: 'todo-service' },
  transports: [new transports.Console()],
};

const logger = createLogger(loggerOptions);

switch (config.NODE_ENV) {
  case 'development':
    logger.level = 'debug';
    break;
  case 'test':
    logger.level = 'fatal';
    break;
}

export default logger;
