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

const { parsed: environmentVariables } = expandedResult;
console.log(`environment variables:\n${JSON.stringify(environmentVariables, null, 2)}`);

module.exports = environmentVariables;
