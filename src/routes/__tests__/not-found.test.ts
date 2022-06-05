import app from '../../app';

import request from 'supertest';

describe('route not found', () => {
  it('should return status code 404', async () => {
    const res = await request(app).get('/thisRouteDoesNotExistInTheApp');

    expect(res.statusCode).toEqual(404);
  });
});
