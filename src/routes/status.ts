import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

import logger from '../utils/logger';

dayjs.extend(duration);

const getStartedAt = (uptimeMillis = 0): string => {
  const now = dayjs();
  const uptimeDuration = dayjs.duration(uptimeMillis);
  const startedAt = now.subtract(uptimeDuration);
  return startedAt.format('YYYY-MM-DD[T]HH:mm:ssZ[Z]');
};

const getUptime = (uptimeMillis = 0): string => {
  const uptimeDuration = dayjs.duration(uptimeMillis);
  const uptimeFormat = 'M[m] D[d] H[h] m[m] s[s]';
  return uptimeDuration.format(uptimeFormat);
};

enum ServerStatus {
  UP = 'UP',
  DOWN = 'DOWN',
}
enum DatabaseStatus {
  CONNECTED = 'CONNECTED',
  DISCONNECTED = 'DISCONNECTED',
}
type SystemStatus = ServerStatus | DatabaseStatus;

interface Status {
  status: SystemStatus;
  startedAt?: string;
  uptime?: string;
}

const serverStatus = (): Status => {
  try {
    const upMillis = Math.floor(process.uptime()) * 1000;
    const startedAt = getStartedAt(upMillis);
    const uptime = getUptime(upMillis);

    return {
      status: ServerStatus.UP,
      startedAt,
      uptime,
    };
  } catch (err) {
    logger.error('Server status check failed.', err);
    return {
      status: ServerStatus.DOWN,
    };
  }
};

const databaseStatus = (): Status => {
  try {
    const connectionState = mongoose.connection.readyState;

    if (connectionState === mongoose.ConnectionStates.connected) {
      return {
        status: DatabaseStatus.CONNECTED,
      };
    } else {
      return {
        status: DatabaseStatus.DISCONNECTED,
      };
    }
  } catch (err) {
    logger.error('Database status check failed.', err);
    return {
      status: DatabaseStatus.DISCONNECTED,
    };
  }
};

export const status = async (req: Request, res: Response, next: NextFunction) => {
  try {
    logger.info('handler::status');
    const server = serverStatus();
    const database = databaseStatus();
    res.send({
      server,
      database,
    });
  } catch (err) {
    next(err);
  }
};
