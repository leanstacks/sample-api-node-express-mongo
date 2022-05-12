import { createLogger, format, LoggerOptions, transports } from 'winston';

const loggerOptons: LoggerOptions = {
  level: 'info',
  format: format.combine(format.timestamp(), format.json()),
  defaultMeta: { service: 'todo-service' },
  transports: [new transports.Console()],
};

export const logger = createLogger(loggerOptons);
