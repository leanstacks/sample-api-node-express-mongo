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
  level: config.LOG_LEVEL,
  levels,
  format: format.combine(format.timestamp(), format.json()),
  defaultMeta: { service: 'todo-service' },
  transports: [new transports.Console()],
};

const logger = createLogger(loggerOptions);

export default logger;
