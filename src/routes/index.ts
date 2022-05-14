// routes/index.ts

import express from 'express';
import passport from 'passport';

// route handlers
import { health } from './health';
import { status } from './status';
import { notFound } from './not-found';

const router = express.Router();

router.get('/health', health);
router.get('/status', status);
router.all('*', notFound);

export default router;
