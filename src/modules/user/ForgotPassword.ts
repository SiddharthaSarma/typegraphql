import { Arg, Mutation, Resolver } from 'type-graphql';
import { v4 } from 'uuid';
import { User } from '../../entity/User';
import { redis } from '../../redis';
import { sendEmail } from '../../utils/SendEmail';
import { forgotPasswordPrefix } from '../constants/redisPrefixer';

@Resolver()
export class ForgotPasswordResolver {
  @Mutation(() => Boolean)
  async forgotPasswordUser(@Arg('email') email: string): Promise<boolean> {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return true;
    }
    const token = v4();
    await redis.set(forgotPasswordPrefix + token, email, 'ex', 60 * 60 * 24);
    await sendEmail(
      email,
      `http://localhost:3000/user/change-password/${token}`
    );

    return true;
  }
}
