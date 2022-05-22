// routes/v1/auth/index.ts

import express from 'express';

// auth route handlers
import { signIn } from './sign-in';
import { signUp } from './sign-up';
import { createToken } from './token-create';

const router = express.Router();

router.post('/signin', signIn);
router.post('/signup', signUp);
router.post('/token', createToken);

export default router;
