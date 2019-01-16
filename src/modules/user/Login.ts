import { Resolver, Mutation, Arg, Ctx } from 'type-graphql';
import { User } from '../../entity/User';
import bcrypt from 'bcryptjs';
import { MyContext } from 'src/types/MyContext';

@Resolver()
export class LoginResolver {
  @Mutation(() => User)
  async loginUser(
    @Arg('email') email: string,
    @Arg('password') password: string,
    @Ctx() ctx: MyContext
  ): Promise<User | null> {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return null;
    }
    const valid = bcrypt.compare(password, user.password);
    if (!valid) {
      return null;
    }
    if (!user.confirmed) {
      return null;
    }
    ctx.req.session!.userId = user.id;
    return user;
  }
}
