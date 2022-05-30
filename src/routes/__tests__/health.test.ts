import app from '../../app';

import request from 'supertest';

describe('GET /health', () => {
  it('should return status code 200', async () => {
    const res = await request(app).get('/health');

    expect(res.statusCode).toEqual(200);
  });

  it('should return body with status', async () => {
    const res = await request(app).get('/health');

    expect(res.headers['content-type']).toMatch(/json/);
    expect(res.body.status).toEqual('UP');
  });
});
