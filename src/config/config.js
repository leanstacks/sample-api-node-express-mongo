const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');

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
  SERVER_BASEURL: `http://localhost:3001`,
  SERVER_HOST: 'localhost',
  SERVER_PORT: 3001,
};

const config = Object.assign(defaultConfig, environmentConfig);
console.log(`config:\n${JSON.stringify(config, null, 2)}`);

module.exports = config;
