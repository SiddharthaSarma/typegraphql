import { Resolver, Mutation, Arg, Ctx } from 'type-graphql';
import { User } from '../../entity/User';
import bcrypt from 'bcryptjs';
import { MyContext } from 'src/types/MyContext';

@Resolver()
export class LoginResolver {
  @Mutation(() => User)
  async LoginUser(
    @Arg('email') email: string,
    @Arg('password') password: string,
    @Ctx() ctx: MyContext
  ): Promise<User | undefined> {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return undefined;
    }
    const valid = bcrypt.compare(password, user.password);
    if (!valid) {
      return undefined;
    }
    ctx.req.session!.userId = user.id;
    return user;
  }
}
