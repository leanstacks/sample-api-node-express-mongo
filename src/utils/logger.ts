import { createLogger, format, LoggerOptions, transports } from 'winston';

import config from '../config/config';

const loggerOptions: LoggerOptions = {
  level: 'info',
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
    logger.level = 'error';
    break;
}

export default logger;
