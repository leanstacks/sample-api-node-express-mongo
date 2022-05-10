import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';

interface ConfigProps {
  MONGO_DBNAME: string;
  MONGO_INMEMORY: string;
  MONGO_URL: string;
  NODE_ENV: string;
  SERVER_PORT: string;
  SERVER_HOST: string;
  SERVER_BASEURL: string;
}

const defaultConfig: ConfigProps = {
  MONGO_DBNAME: 'todo_db',
  MONGO_INMEMORY: 'false',
  MONGO_URL: 'mongodb://username:password@host:27017',
  NODE_ENV: 'development',
  SERVER_BASEURL: 'http://localhost:3001',
  SERVER_HOST: 'localhost',
  SERVER_PORT: '3001',
};

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

const config: ConfigProps = Object.assign(defaultConfig, dotenvExpandOutput.parsed);
export default config;
