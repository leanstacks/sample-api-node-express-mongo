// routes/v1/auth/index.ts

import express from 'express';
import passport from 'passport';

// auth route handlers
import { createToken } from './token-create';
import { verifyToken } from './token-verify';

const router = express.Router();

// router.post('/authorize', authorize);
router.post('/token', passport.authenticate('anonymous', { session: false }), createToken);
router.get('/verify', passport.authenticate('jwt', { session: false }), verifyToken);

export default router;
