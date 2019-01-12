import { Resolver, Query, Mutation, Arg } from 'type-graphql';
import { User } from '../../entity/User';
import bcrypt from 'bcryptjs';

@Resolver()
export class HelloResolver {
  @Query(() => User)
  async getUserDetails(@Arg('ID') ID: number): Promise<User | undefined> {
    const user = await User.findOne({ id: ID });
    return user;
  }

  @Mutation(() => User)
  async registerUser(
    @Arg('firstName') firstName: string,
    @Arg('lastName') lastName: string,
    @Arg('email') email: string,
    @Arg('password') password: string
  ): Promise<User> {
    const hasedPassword = await bcrypt.hash(password, 12);
    const user = User.create({
      firstName,
      lastName,
      email,
      password: hasedPassword
    }).save();
    return user;
  }
}
