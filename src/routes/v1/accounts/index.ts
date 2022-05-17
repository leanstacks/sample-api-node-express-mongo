// routes/v1/accounts/index.ts

import express from 'express';
import passport from 'passport';

// account route handlers
import { findAccount } from './account-find';
import { listAccounts } from './account-list';
import { createAccount } from './account-create';
import { updateAccount } from './account-update';
import { deleteAccount } from './account-delete';

const router = express.Router();

router.post('/', passport.authenticate('anonymous', { session: false }), createAccount);
router.get('/', passport.authenticate('anonymous', { session: false }), listAccounts);
router.get('/:id', passport.authenticate('anonymous', { session: false }), findAccount);
router.put('/:id', passport.authenticate('anonymous', { session: false }), updateAccount);
router.delete('/:id', passport.authenticate('anonymous', { session: false }), deleteAccount);

export default router;
