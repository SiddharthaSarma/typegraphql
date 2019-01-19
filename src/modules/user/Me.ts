import { MyContext } from 'src/types/MyContext';
import { Ctx, Query, Resolver, UseMiddleware } from 'type-graphql';
import { User } from '../../entity/User';
import { isAuth } from '../../middlewares/IsAuth';

@Resolver()
export class MeResolver {
  @UseMiddleware(isAuth)
  @Query(() => User)
  async Me(@Ctx() ctx: MyContext): Promise<User | undefined> {
    const user = await User.findOne(ctx.req.session!.userId);
    return user;
  }
}
