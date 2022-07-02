import crypto from 'crypto';
import { ChangeFunction } from './evolution';
import logger from '../utils/logger';

const random: ChangeFunction = async (): Promise<void> => {
  const randomString = crypto.randomBytes(4).toString('hex');
  logger.info('> ChangeFunction::random');
  logger.debug(`random:${randomString}`);
  logger.info('< ChangeFunction::random');
  return;
};

export default random;
