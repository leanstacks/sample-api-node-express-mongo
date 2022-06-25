import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { IAccount } from '../../models/account';
import AccountService, { AccountExistsError } from '../account-service';

import { accountFixture, accountsFixture } from '../../tests/fixtures';

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
    const account = await AccountService.createOne(accountFixture);
    expect(account.id).not.toBeNull();
    expect(account.password).not.toBeNull();
    expect(account.password).not.toEqual(accountFixture.password);
    expect(account.username).toEqual(accountFixture.username);

    const foundAccount = await AccountService.findOne(account.id?.toString() || '');
    expect(foundAccount).not.toBeNull();
  });

  it('should throw AccountExistsError when creating with non-unique username', async () => {
    const account = await AccountService.createOne(accountFixture);
    expect(account).not.toBeNull();

    try {
      await AccountService.createOne(accountFixture);
    } catch (err: AccountExistsError | unknown) {
      expect(err instanceof AccountExistsError).toBeTruthy();
    }
  });

  it('should list all Accounts', async () => {
    let accounts = await AccountService.list();
    expect(accounts.length).toEqual(0);

    await AccountService.createOne(accountsFixture[0]);
    await AccountService.createOne(accountsFixture[1]);

    accounts = await AccountService.list();
    expect(accounts.length).toEqual(2);
  });

  it('should find an Account by id', async () => {
    const account = await AccountService.createOne(accountFixture);
    expect(account.id).not.toBeNull();

    const foundAccount = await AccountService.findOne(account.id?.toString() || '');
    expect(foundAccount).not.toBeNull();
    expect(foundAccount?.id).toEqual(account.id);
  });

  it('should return null when searching for non-existent id', async () => {
    const account = await AccountService.findOne('doesNotExist');
    expect(account).toBeNull();
  });

  it('should update an Account', async () => {
    const account = await AccountService.createOne(accountFixture);
    expect(account.id).not.toBeNull();
    expect(account.username).toEqual(accountFixture.username);

    account.username = 'two@example.com';
    const updatedAccount = await AccountService.updateOne(account.id?.toString() || '', account);
    expect(updatedAccount).not.toBeNull();
    expect(updatedAccount?.username).toEqual('two@example.com');
  });

  it('should return null when updating a non-existent id', async () => {
    const account = await AccountService.updateOne('doesNotExist', accountFixture);
    expect(account).toBeNull();
  });

  it('should throw AccountExistsError when updating to non-unique username', async () => {
    await AccountService.createOne(accountsFixture[0]);
    const account = await AccountService.createOne(accountsFixture[1]);

    try {
      account.username = 'one@example.com';
      await AccountService.updateOne(account.id?.toString() || '', account);
    } catch (err: AccountExistsError | unknown) {
      expect(err instanceof AccountExistsError).toBeTruthy();
    }
  });

  it('should delete an Account', async () => {
    const account = await AccountService.createOne(accountFixture);
    expect(account.id).not.toBeNull();

    await AccountService.deleteOne(account.id?.toString() || '');

    const deletedAccount = await AccountService.findOne(account.id?.toString() || '');
    expect(deletedAccount).toBeNull();
  });

  it('should successfully authenticate', async () => {
    const account = await AccountService.createOne(accountFixture);
    expect(account.id).not.toBeNull();

    const authenticated = await AccountService.authenticate(
      accountFixture.username,
      accountFixture.password,
    );
    expect(authenticated).not.toBeNull();
    expect(authenticated?.id).toEqual(account.id);
  });

  it('should fail to authenticate', async () => {
    const account = await AccountService.createOne(accountFixture);
    expect(account.id).not.toBeNull();

    const authenticated = await AccountService.authenticate(
      accountFixture.username,
      'someOtherPassword1!',
    );
    expect(authenticated).toBeNull();
  });

  it('should lock account after N failed authentication attempts', async () => {
    const account = await AccountService.createOne(accountFixture);
    expect(account.id).not.toBeNull();

    let authenticated = await AccountService.authenticate(
      accountFixture.username,
      'someOtherPassword1!',
    );
    expect(authenticated).toBeNull();

    authenticated = await AccountService.authenticate(
      accountFixture.username,
      'someOtherPassword1!',
    );
    expect(authenticated).toBeNull();

    authenticated = await AccountService.authenticate(
      accountFixture.username,
      'someOtherPassword1!',
    );
    expect(authenticated).toBeNull();

    const lockedAccount = await AccountService.findOne(account.id as string);
    expect(lockedAccount?.isLocked).toEqual(true);
  });
});
