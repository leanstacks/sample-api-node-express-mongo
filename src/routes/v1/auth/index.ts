// routes/v1/auth/index.ts

import express from 'express';
import passport from 'passport';

// auth route handlers
import { createToken } from './token-create';

const router = express.Router();

// router.post('/authorize', authorize);
router.post('/token', passport.authenticate('anonymous', { session: false }), createToken);

export default router;
