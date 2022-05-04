const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');

const logger = require('../utils/logger');

// initialize the application configuration
const result = dotenv.config();
if (result.error) {
  throw result.error;
}
// application configuration variable expansion
const expandedResult = dotenvExpand.expand(result);
if (expandedResult.error) {
  throw expandedResult.error;
}

const { parsed: environmentConfig } = expandedResult;

const defaultConfig = {
  MONGO_DBNAME: 'todo_db',
  MONGO_INMEMORY: 'false',
  MONGO_URL: 'mongodb://username:password@host:27017',
  NODE_ENV: 'development',
  SERVER_BASEURL: 'http://localhost:3001',
  SERVER_HOST: 'localhost',
  SERVER_PORT: '3001',
};

const config = Object.assign(defaultConfig, environmentConfig);
logger.info(`config:\n${JSON.stringify(config, null, 2)}`);

module.exports = config;
