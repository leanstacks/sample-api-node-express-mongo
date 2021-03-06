import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import passport from 'passport';

import { strategyAnonymous } from './middleware/auth-strategy-anonymous';
import { strategyBasic } from './middleware/auth-strategy-basic';
import { strategyJwt } from './middleware/auth-strategy-jwt';
import { loggingMiddleware } from './middleware/logging';
import v1 from './routes/v1';
import baseRoutes from './routes';
import { errorHandler, logErrors } from './middleware/errors';

// create the Express app
const app = express();

// configure Express middleware
// Helmet - enhances API security
app.use(helmet());
// JSON - built-in middleware to parse JSON bodies into JS objects
app.use(express.json());
// CORS - enable cross-origin support
app.use(cors());
// Logging - log HTTP events
app.use(loggingMiddleware);
// Passport - API security
app.use(passport.initialize());
passport.use(strategyJwt);
passport.use(strategyBasic);
passport.use(strategyAnonymous);

// configure Express routes / handlers
// api version1 routes
app.use('/v1', v1);

// default routes
app.use('/', passport.authenticate('anonymous', { session: false }), baseRoutes);

// error middleware
app.use(logErrors);
app.use(errorHandler);

export default app;
