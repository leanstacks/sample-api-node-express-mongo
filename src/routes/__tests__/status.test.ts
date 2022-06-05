import app from '../../app';
import mongoose from 'mongoose';

import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';

describe('GET /status', () => {
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

  it('should return status code 200', async () => {
    const res = await request(app).get('/status');

    expect(res.statusCode).toEqual(200);
  });

  it('should return content type "application/json"', async () => {
    const res = await request(app).get('/status');

    expect(res.headers['content-type']).toMatch(/json/);
  });

  it('should return server status UP', async () => {
    const res = await request(app).get('/status');

    expect(res.body.server.status).toEqual('UP');
  });

  it('should return database status CONNECTED', async () => {
    const res = await request(app).get('/status');

    expect(res.body.database.status).toEqual('CONNECTED');
  });
});
