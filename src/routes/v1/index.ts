// routes/v1/index.ts

import express from 'express';
import passport from 'passport';

// routes

import authRoutes from './auth';
import accountRoutes from './accounts';
import todoRoutes from './todos';

const router = express.Router();

router.use('/auth', passport.authenticate('anonymous', { session: false }), authRoutes);
router.use('/accounts', passport.authenticate('jwt', { session: false }), accountRoutes);
router.use('/todos', passport.authenticate('jwt', { session: false }), todoRoutes);

export default router;
