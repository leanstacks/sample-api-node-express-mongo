// routes/v1/index.ts

import express from 'express';
import passport from 'passport';

// routes

import authRoutes from './auth';
import accountRoutes from './accounts';
import todoRoutes from './todos';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/accounts', accountRoutes);
router.use('/todos', passport.authenticate('jwt', { session: false }), todoRoutes);

export default router;
