import config from '../config';

describe('config', () => {
  it('should have values', () => {
    expect(config.JWT_AUDIENCE).not.toBeNull();
    expect(config.JWT_ACCESS_TOKEN_EXPIRES_IN).not.toBeNull();
    expect(config.JWT_ISSUER).not.toBeNull();
    expect(config.JWT_REFRESH_TOKEN_EXPIRES_IN).not.toBeNull();
    expect(config.JWT_SECRET).not.toBeNull();

    expect(config.MONGO_DBNAME).not.toBeNull();
    expect(config.MONGO_INMEMORY).not.toBeNull();
    expect(config.MONGO_URL).not.toBeNull();

    expect(config.NODE_ENV).not.toBeNull();

    expect(config.SERVER_BASEURL).not.toBeNull();
    expect(config.SERVER_HOST).not.toBeNull();
    expect(config.SERVER_PORT).not.toBeNull();
  });

  it('should have values of type', () => {
    expect(typeof config.JWT_AUDIENCE).toEqual('string');
    expect(typeof config.JWT_ACCESS_TOKEN_EXPIRES_IN).toEqual('number');
    expect(typeof config.JWT_ISSUER).toEqual('string');
    expect(typeof config.JWT_REFRESH_TOKEN_EXPIRES_IN).toEqual('number');
    expect(typeof config.JWT_SECRET).toEqual('string');

    expect(typeof config.MONGO_DBNAME).toEqual('string');
    expect(typeof config.MONGO_INMEMORY).toEqual('boolean');
    expect(typeof config.MONGO_URL).toEqual('string');

    expect(typeof config.NODE_ENV).toEqual('string');

    expect(typeof config.SERVER_BASEURL).toEqual('string');
    expect(typeof config.SERVER_HOST).toEqual('string');
    expect(typeof config.SERVER_PORT).toEqual('number');
  });
});
