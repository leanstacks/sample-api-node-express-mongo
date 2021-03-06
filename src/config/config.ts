import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';
import Joi from 'joi';

interface ConfigProps {
  AUTH_ATTEMPTS_MAX: number;
  AUTH_PASSWORD_EXPIRES_IN_DAYS: number;
  AUTH_PASSWORD_HISTORY_COUNT: number;
  AUTH_PASSWORD_REUSE_COUNT: number;
  JWT_AUDIENCE: string;
  JWT_ACCESS_TOKEN_EXPIRES_IN: number;
  JWT_ISSUER: string;
  JWT_REFRESH_TOKEN_EXPIRES_IN: number;
  JWT_SECRET: string;
  LOG_LEVEL: string;
  MONGO_DBNAME: string;
  MONGO_INMEMORY: string;
  MONGO_URL: string;
  NODE_ENV: string;
  SERVER_PORT: number;
  SERVER_HOST: string;
  SERVER_BASEURL: string;
}

const configSchema = Joi.object({
  AUTH_ATTEMPTS_MAX: Joi.number().default(3),
  AUTH_PASSWORD_EXPIRES_IN_DAYS: Joi.number().default(60),
  AUTH_PASSWORD_HISTORY_COUNT: Joi.number().default(5),
  AUTH_PASSWORD_REUSE_COUNT: Joi.number().default(3),
  JWT_AUDIENCE: Joi.string().default('leanstacks.net'),
  JWT_ACCESS_TOKEN_EXPIRES_IN: Joi.number().default(3600),
  JWT_ISSUER: Joi.string().default('todos.leanstacks.net'),
  JWT_REFRESH_TOKEN_EXPIRES_IN: Joi.number().default(86400),
  JWT_SECRET: Joi.string().default('762af28c0ae24ba19df1c8761ed983e7'),
  LOG_LEVEL: Joi.string().valid('verbose', 'debug', 'info', 'error', 'fatal').default('info'),
  MONGO_DBNAME: Joi.string().default('todo_db'),
  MONGO_INMEMORY: Joi.boolean().default(false),
  MONGO_URL: Joi.string().default('mongodb://username:password@host:27017'),
  NODE_ENV: Joi.string().valid('development', 'test', 'production').default('development'),
  SERVER_BASEURL: Joi.string().uri().default('http://localhost:3001'),
  SERVER_HOST: Joi.string().default('localhost'),
  SERVER_PORT: Joi.number().default(3001),
});

// initialize the application configuration
const dotenvConfigOutput = dotenv.config();
if (dotenvConfigOutput.error) {
  throw dotenvConfigOutput.error;
}
// application configuration variable expansion
const dotenvExpandOutput = dotenvExpand.expand(dotenvConfigOutput);
if (dotenvExpandOutput.error) {
  throw dotenvExpandOutput.error;
}

// validate the configuration
const { value: config, error } = configSchema.validate(dotenvExpandOutput.parsed);
if (error) {
  throw new Error(`Configuration validation failed. ${error.message}`);
}

export default config as ConfigProps;
