const { MongoMemoryServer } = require('mongodb-memory-server');
const { MongoClient } = require('mongodb');

const logger = require('../utils/logger');
const { MONGO_DBNAME, MONGO_INMEMORY, MONGO_URL } = require('../config/config');

let database = null;

const startDatabase = async () => {
  logger.info('starting database');
  try {
    let mongo = null;
    if (MONGO_INMEMORY === 'true') {
      mongo = await MongoMemoryServer.create();
    }
    const connectionUrl = mongo ? mongo.getUri() : MONGO_URL;
    logger.info(`connecting to database at: ${connectionUrl}`);
    const connection = await MongoClient.connect(connectionUrl);
    database = connection.db(MONGO_DBNAME);
  } catch (err) {
    logger.error('Unable to connect to database.', err);
  }
};

const getDatabase = async () => {
  if (!database) {
    await startDatabase();
  }
  return database;
};

module.exports = {
  getDatabase,
  startDatabase,
};
