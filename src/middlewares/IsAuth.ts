import { MyContext } from 'src/types/MyContext';
import { MiddlewareFn } from 'type-graphql';

export const isAuth: MiddlewareFn<MyContext> = ({ context }, next) => {
  if (context.req.session!.userId) {
    throw new Error('User is not authorised');
  }
  return next();
};
