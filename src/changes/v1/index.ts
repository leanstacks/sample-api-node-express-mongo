import { ChangeFunction } from '../evolution';
import createAdminAccount from './create-admin-account';

const changes: ChangeFunction[] = [];

changes.push(createAdminAccount);

export default changes;
