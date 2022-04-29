const { MongoMemoryServer } = require('mongodb-memory-server');
const { MongoClient } = require('mongodb');

const { MONGO_INMEMORY, MONGO_URL } = require('../config/config');

let database = null;

const startDatabase = async () => {
  console.log('starting database');
  let mongo = null;
  if (MONGO_INMEMORY === 'true') {
    mongo = await MongoMemoryServer.create();
  }
  const connectionUrl = !!mongo ? mongo.getUri() : MONGO_URL;
  console.log(`connecting to database at: ${connectionUrl}`);
  const connection = await MongoClient.connect(connectionUrl);
  database = connection.db();
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
