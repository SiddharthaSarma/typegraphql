import { Resolver, Query, Mutation, Arg, Authorized } from 'type-graphql';
import { User } from '../../entity/User';
import bcrypt from 'bcryptjs';
import { RegisterInput } from './register/RegisterInput';
import { sendEmail } from '../../utils/SendEmail';
import { createConfirmLink } from '../../utils/CreateConfirmLink';

@Resolver()
export class RegisterResolver {
  @Authorized()
  @Query(() => User)
  async getUserDetails(@Arg('ID') ID: number): Promise<User | undefined> {
    const user = await User.findOne({ id: ID });
    return user;
  }

  @Mutation(() => User)
  async registerUser(@Arg('input')
  {
    firstName,
    lastName,
    email,
    password
  }: RegisterInput): Promise<User> {
    const hasedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: hasedPassword
    }).save();

    await sendEmail(email, await createConfirmLink(user.id));

    return user;
  }
}
