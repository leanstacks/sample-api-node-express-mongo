import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

import Account from '../account';

describe('Account Model', () => {
  let mongo: MongoMemoryServer;

  beforeAll(async () => {
    mongo = await MongoMemoryServer.create();
    mongoose.connect(mongo.getUri());
  });

  afterEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  });

  afterAll(async () => {
    await mongoose.connection.close();
    await mongo.stop();
  });

  it('should create an Account', async () => {
    const data = {
      username: 'user@example.com',
      password: 'IamApassword1!',
      isActive: true,
      isLocked: false,
    };

    const account = new Account(data);
    await account.save();
    expect(account).not.toBeNull();
    expect(account._id).not.toBeNull();
  });

  it('should have "id" in JSON', async () => {
    const data = {
      username: 'user@example.com',
      password: 'IamApassword1!',
      isActive: true,
      isLocked: false,
    };

    const account = new Account(data);
    await account.save();
    expect(account).not.toBeNull();
    expect(account.toJSON().id).not.toBeNull();
    expect(account._id).toEqual(account.toJSON().id);
  });

  it('should not have "_id" in JSON', async () => {
    const data = {
      username: 'user@example.com',
      password: 'IamApassword1!',
      isActive: true,
      isLocked: false,
    };

    const account = new Account(data);
    await account.save();
    expect(account).not.toBeNull();
    expect(JSON.stringify(account.toJSON())).not.toMatch(/_id/);
  });

  it('should not have private attributes in JSON', async () => {
    const data = {
      username: 'user@example.com',
      password: 'IamApassword1!',
      isActive: true,
      isLocked: false,
    };

    const account = new Account(data);
    await account.save();
    expect(account).not.toBeNull();
    expect(JSON.stringify(account.toJSON())).not.toMatch(/"password"/);
  });
});
