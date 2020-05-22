import express from 'express';
import { ApolloServer } from 'apollo-server-express';

import typeDefs from './schemas';
import resolvers from './resolvers';

import { UserAPI, CardSetAPI } from './datasources';

import connectToDb from './db/connection';

const apolloServerStart = (store) => {
  const server = new ApolloServer({
    context: async ({ req }) => {
      return {
        token: req.headers?.authorization,
      };
    },
    typeDefs,
    resolvers,
    dataSources: () => ({
      userAPI: new UserAPI(store),
      cardSetAPI: new CardSetAPI(store),
    }),
  });

  const app = express();

  server.applyMiddleware({ app });

  app.listen(
    { port: 4000 },
    () => console.log(`Server ready at http://localhost:4000${server.graphqlPath}`) // eslint-disable-line no-console
  );
};

connectToDb(apolloServerStart);
