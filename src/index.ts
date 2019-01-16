import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-express';
import Express from 'express';
import { buildSchema, formatArgumentValidationError } from 'type-graphql';
import { createConnection } from 'typeorm';
import { RegisterResolver } from './modules/user/Register';
import session from 'express-session';
import connectRedis from 'connect-redis';
import cors from 'cors';
import { redis } from './redis';
import { LoginResolver } from './modules/user/Login';
import { MeResolver } from './modules/user/Me';
import { ConfirmUserResolver } from './modules/user/ConfirmUser';

const main = async () => {
  await createConnection();
  const schema = await buildSchema({
    resolvers: [
      RegisterResolver,
      LoginResolver,
      MeResolver,
      ConfirmUserResolver
    ],
    authChecker: ({ context }) => {
      return !!context.req.session.userId;
    }
  });
  const app = Express();
  const apolloServer = new ApolloServer({
    schema,
    formatError: formatArgumentValidationError,
    context: ({ req }: any) => ({ req })
  });
  const RedisStore = connectRedis(session);
  app.use(
    cors({
      credentials: true,
      origin: 'http://localhost:3000'
    })
  );

  app.use(
    session({
      store: new RedisStore({
        client: redis as any
      }),
      name: 'qid',
      secret: 'abcdefghijklmnopqrstuvwxyz',
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 24 * 7 * 365 // 7 years
      }
    })
  );
  apolloServer.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log('Server started on http://localhost:4000/graphql');
  });
};

main();
