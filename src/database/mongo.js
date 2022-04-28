const { MongoMemoryServer } = require('mongodb-memory-server');
const { MongoClient } = require('mongodb');

const { MONGO_URL } = require('../config/config');

let database = null;

const startDatabase = async () => {
  // const mongo = await MongoMemoryServer.create();
  // const MONGO_URL = mongo.getUri();
  const connection = await MongoClient.connect(MONGO_URL);
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
