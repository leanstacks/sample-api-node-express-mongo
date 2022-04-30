const dayjs = require('dayjs');
const duration = require('dayjs/plugin/duration');

const { getDatabase } = require('../database/mongo');

dayjs.extend(duration);

const getStartedAt = (uptimeMillis = 0) => {
  const now = dayjs();
  const uptimeDuration = dayjs.duration(uptimeMillis);
  const startedAt = now.subtract(uptimeDuration);
  return startedAt.format('YYYY-MM-DD[T]HH:mm:ssZ[Z]');
};

const getUptime = (uptimeMillis = 0) => {
  const uptimeDuration = dayjs.duration(uptimeMillis);
  const uptimeFormat = 'M[m] D[d] H[h] m[m] s[s]';
  return uptimeDuration.format(uptimeFormat);
};

const ServerStatus = {
  UP: 'UP',
  DOWN: 'DOWN',
};

const serverStatus = () => {
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
    console.error('Server status check failed.', err);
    return {
      status: ServerStatus.DOWN,
    };
  }
};

const DatabaseStatus = {
  CONNECTED: 'CONNECTED',
  DISCONNECTED: 'DISCONNECTED',
};

const databaseStatus = async () => {
  try {
    const database = await getDatabase();
    const databaseStatus = await database.command({ dbStats: 1 });

    return {
      status: DatabaseStatus.CONNECTED,
    };
  } catch (err) {
    console.error('Database status check failed.', err);
    return {
      status: DatabaseStatus.DISCONNECTED,
    };
  }
};

const status = async (req, res, next) => {
  try {
    console.log('handler::status');
    const server = serverStatus();
    const database = await databaseStatus();
    res.send({
      server,
      database,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  status,
};
