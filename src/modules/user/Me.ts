import { Resolver, Query, Ctx } from 'type-graphql';
import { User } from '../../entity/User';
import { MyContext } from 'src/types/MyContext';

@Resolver()
export class MeResolver {
  @Query(() => User)
  async Me(@Ctx() ctx: MyContext): Promise<User | undefined> {
    const user = await User.findOne(ctx.req.session!.userId);
    return user;
  }
}
