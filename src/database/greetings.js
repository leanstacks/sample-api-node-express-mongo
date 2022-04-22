const crypto = require('crypto');

const { getDatabase } = require('./mongo');

const collectionName = 'greetings';

const insertGreeting = async (greeting) => {
  const database = await getDatabase();
  const greetingToCreate = {
    _id: crypto.randomBytes(8).toString('hex'),
    ...greeting,
  };
  await database.collection(collectionName).insertOne(greetingToCreate);

  return greetingToCreate;
};

const getGreetings = async () => {
  const database = await getDatabase();
  return await database.collection(collectionName).find({}).toArray();
};

const getGreeting = async (id) => {
  const database = await getDatabase();
  return await database.collection(collectionName).findOne({ _id: id });
};

const updateGreeting = async (id, greeting) => {
  const database = await getDatabase();
  delete greeting._id;
  await database.collection(collectionName).update(
    { _id: id },
    {
      $set: {
        ...greeting,
      },
    }
  );
  return greeting;
};

const deleteGreeting = async (id) => {
  const database = await getDatabase();
  await database.collection(collectionName).deleteOne({
    _id: id,
  });
};

module.exports = {
  deleteGreeting,
  getGreeting,
  getGreetings,
  insertGreeting,
  updateGreeting,
};
