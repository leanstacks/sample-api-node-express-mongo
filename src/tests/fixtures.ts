import { IAccount } from '../models/account';
import { ITodo } from '../models/todo';

export const accountFixture: IAccount = {
  id: '62b4b72f1623125f9cb9cc01',
  username: 'user@example.com',
  password: 'StrongP@ssw0rd',
  isActive: true,
  isLocked: false,
  invalidAuthenticationCount: 0,
  passwordHistory: [],
};

export const accountsFixture: IAccount[] = [
  {
    id: '62b4b72f1623125f9cb9cc01',
    username: 'user@example.com',
    password: 'StrongP@ssw0rd',
    isActive: true,
    isLocked: false,
    invalidAuthenticationCount: 0,
    passwordHistory: [],
  },
  {
    id: '62b4b72f1623125f9cb9cc02',
    username: 'user2@example.com',
    password: 'StrongP@ssw0rd',
    isActive: true,
    isLocked: false,
    invalidAuthenticationCount: 0,
    passwordHistory: [],
  },
];

export const todoFixture: ITodo = {
  id: '12b4b72f1623125f9cb9cc01',
  account: '62b4b72f1623125f9cb9cc01',
  title: 'Write the code',
  isComplete: false,
};

export const todosFixture: ITodo[] = [
  {
    id: '12b4b72f1623125f9cb9cc01',
    account: '62b4b72f1623125f9cb9cc01',
    title: 'Write the code',
    isComplete: true,
  },
  {
    id: '12b4b72f1623125f9cb9cc02',
    account: '62b4b72f1623125f9cb9cc01',
    title: 'Test the code',
    isComplete: false,
  },
];
