// routes/v1/auth/index.ts

import express from 'express';
import passport from 'passport';

// auth route handlers
import { signIn } from './sign-in';
import { signUp } from './sign-up';
import { createToken } from './token-create';

const router = express.Router();

router.post('/signin', passport.authenticate('anonymous', { session: false }), signIn);
router.post('/signup', passport.authenticate('anonymous', { session: false }), signUp);
router.post('/token', passport.authenticate('anonymous', { session: false }), createToken);

export default router;
