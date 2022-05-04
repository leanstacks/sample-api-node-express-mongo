const crypto = require('crypto');

const { getDatabase } = require('./mongo');

const collectionName = 'todos';

exports.create = async (todo) => {
  const database = await getDatabase();
  const todoToCreate = {
    _id: crypto.randomBytes(8).toString('hex'),
    isComplete: false,
    ...todo,
  };
  await database.collection(collectionName).insertOne(todoToCreate);

  return todoToCreate;
};

exports.findAll = async () => {
  const database = await getDatabase();
  return database.collection(collectionName).find({}).toArray();
};

exports.findById = async (id) => {
  const database = await getDatabase();
  return database.collection(collectionName).findOne({ _id: id });
};

exports.update = async (id, todo) => {
  const database = await getDatabase();
  const todoToUpdate = todo;
  delete todoToUpdate._id;
  await database.collection(collectionName).update(
    { _id: id },
    {
      $set: {
        ...todoToUpdate,
      },
    },
  );
  return this.findById(id);
};

exports.delete = async (id) => {
  const database = await getDatabase();
  await database.collection(collectionName).deleteOne({
    _id: id,
  });
};
