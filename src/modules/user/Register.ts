import { Resolver, Query, Mutation, Arg } from 'type-graphql';
import { User } from '../../entity/User';
import * as bcrypt from 'bcryptjs';

@Resolver()
export class HelloResolver {
  @Query(() => String, { name: 'helloworld' })
  async hello() {
    return 'Hello world';
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
