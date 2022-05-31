import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { IAccount } from '../../models/account';
import AccountService, { AccountExistsError } from '../account-service';

describe('AccountService', () => {
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
    const data: IAccount = {
      username: 'user@example.com',
      password: 'P@ssW0rdSuccess!',
    };
    const service = new AccountService();

    const account = await service.createOne(data);
    expect(account.id).not.toBeNull();
    expect(account.password).not.toBeNull();
    expect(account.password).not.toEqual('P@ssW0rdSuccess!');
    expect(account.username).toEqual(data.username);

    const foundAccount = await service.findOne(account.id?.toString() || '');
    expect(foundAccount).not.toBeNull();
  });

  it('should throw AccountExistsError when creating with non-unique username', async () => {
    const data: IAccount = {
      username: 'user@example.com',
      password: 'P@ssW0rdSuccess!',
    };
    const service = new AccountService();

    const account = await service.createOne(data);
    expect(account).not.toBeNull();

    try {
      await service.createOne(data);
    } catch (err: AccountExistsError | unknown) {
      expect(err instanceof AccountExistsError).toBeTruthy();
    }
  });

  it('should list all Accounts', async () => {
    const service = new AccountService();

    let accounts = await service.list();
    expect(accounts.length).toEqual(0);

    await service.createOne({ username: 'one@example.com', password: 'Iamagoodpassword1!' });
    await service.createOne({ username: 'two@example.com', password: 'Iamagoodpassword1!' });

    accounts = await service.list();
    expect(accounts.length).toEqual(2);
  });

  it('should find an Account by id', async () => {
    const service = new AccountService();

    const account = await service.createOne({ username: 'one@example.com', password: 'Iamagoodpassword1!' });
    expect(account.id).not.toBeNull();

    const foundAccount = await service.findOne(account.id?.toString() || '');
    expect(foundAccount).not.toBeNull();
    expect(foundAccount.id).toEqual(account.id);
  });

  it('should return null when searching for non-existent id', async () => {
    const service = new AccountService();

    const account = await service.findOne('doesNotExist');
    expect(account).toBeNull();
  });

  it('should update an Account', async () => {
    const service = new AccountService();

    const account = await service.createOne({ username: 'one@example.com', password: 'Iamagoodpassword1!' });
    expect(account.id).not.toBeNull();
    expect(account.username).toEqual('one@example.com');

    account.username = 'two@example.com';
    const updatedAccount = await service.updateOne(account.id?.toString() || '', account);
    expect(updatedAccount).not.toBeNull();
    expect(updatedAccount?.username).toEqual('two@example.com');
  });

  it('should return null when updating a non-existent id', async () => {
    const service = new AccountService();

    const account = await service.updateOne('doesNotExist', {
      username: 'one@example.com',
      password: 'Iamagoodpassword1!',
    });
    expect(account).toBeNull();
  });

  it('should throw AccountExistsError when updating to non-unique username', async () => {
    const service = new AccountService();

    await service.createOne({ username: 'one@example.com', password: 'Iamagoodpassword1!' });
    const account = await service.createOne({ username: 'two@example.com', password: 'Iamagoodpassword1!' });

    try {
      account.username = 'one@example.com';
      await service.updateOne(account.id?.toString() || '', account);
    } catch (err: AccountExistsError | unknown) {
      expect(err instanceof AccountExistsError).toBeTruthy();
    }
  });

  it('should delete an Account', async () => {
    const service = new AccountService();

    const account = await service.createOne({ username: 'one@example.com', password: 'Iamagoodpassword1!' });
    expect(account.id).not.toBeNull();

    await service.deleteOne(account.id?.toString() || '');

    const deletedAccount = await service.findOne(account.id?.toString() || '');
    expect(deletedAccount).toBeNull();
  });

  it('should successfully authenticate', async () => {
    const service = new AccountService();
    const username = 'one@example.com';
    const password = 'Iamagoodpassword1!';

    const account = await service.createOne({ username, password });
    expect(account.id).not.toBeNull();

    const authenticated = await service.authenticate(username, password);
    expect(authenticated).not.toBeNull();
    expect(authenticated?.id).toEqual(account.id);
  });

  it('should fail to authenticate', async () => {
    const service = new AccountService();
    const username = 'one@example.com';
    const password = 'Iamagoodpassword1!';

    const account = await service.createOne({ username, password });
    expect(account.id).not.toBeNull();

    const authenticated = await service.authenticate(username, 'someOtherPassword1!');
    expect(authenticated).toBeNull();
  });
});
