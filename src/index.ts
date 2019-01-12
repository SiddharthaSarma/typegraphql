import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-express';
import * as Express from 'express';
import { buildSchema } from 'type-graphql';
import { createConnection } from 'typeorm';
import { HelloResolver } from './modules/user/Register';

const main = async () => {
  await createConnection();
  const schema = await buildSchema({
    resolvers: [HelloResolver]
  });
  const app = Express();
  const apolloServer = new ApolloServer({ schema });
  apolloServer.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log('Server started on http://localhost:4000/graphql');
  });
};

main();
