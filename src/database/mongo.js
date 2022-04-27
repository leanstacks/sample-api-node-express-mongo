const { MongoMemoryServer } = require('mongodb-memory-server');
const { MongoClient } = require('mongodb');

let database = null;

const startDatabase = async () => {
  const mongo = await MongoMemoryServer.create();
  const mongoDBURL = mongo.getUri();
  const connection = await MongoClient.connect(mongoDBURL);
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
