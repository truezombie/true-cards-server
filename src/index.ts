import express from 'express';
import { ApolloServer } from 'apollo-server-express';

import typeDefs from './schemas';
import resolvers from './resolvers';

import { UserAPI, CardSetAPI, LearningAPI } from './datasources';

import { connectToMongoDb, connectToRedis } from './db/connection';

const apolloServerStart = (mongoClient) => {
  const redisClient = connectToRedis();

  const server = new ApolloServer({
    context: async ({ req }) => {
      return {
        token: req.headers?.authorization,
        mongoClient,
        redisClient,
      };
    },
    typeDefs,
    resolvers,
    dataSources: () => ({
      userAPI: new UserAPI(),
      cardSetAPI: new CardSetAPI(),
      learningAPI: new LearningAPI(),
    }),
  });

  const app = express();

  server.applyMiddleware({ app });

  app.listen(
    { port: 4000 },
    () => console.log(`Server ready at http://localhost:4000${server.graphqlPath}`) // eslint-disable-line no-console
  );
};

connectToMongoDb(apolloServerStart);
