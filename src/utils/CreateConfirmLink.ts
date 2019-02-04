import { confirmationPrefix } from 'src/modules/constants/redisPrefixer';
import { v4 } from 'uuid';
import { redis } from '../redis';

export const createConfirmLink = async (userId: number): Promise<string> => {
  const token = v4();
  await redis.set(confirmationPrefix + token, userId, 'ex', 60 * 60 * 24);
  return `http://localhost:3000/user/confirm/${token}`;
};
