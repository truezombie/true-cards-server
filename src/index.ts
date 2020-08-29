import express from 'express';
import { ApolloServer } from 'apollo-server-express';

import typeDefs from './schemas';
import resolvers from './resolvers';

import { UserAPI, CardSetAPI, LearningAPI } from './datasources';

import connectToMongoDb from './db/connection';

const mongoClient = connectToMongoDb();

const apolloServer = new ApolloServer({
  context: async ({ req }) => {
    return {
      token: req.headers?.authorization,
      mongoClient,
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

apolloServer.applyMiddleware({ app });

const server = app.listen(
  { port: 3000 },
  () => console.log(`Server ready at http://localhost:3000${apolloServer.graphqlPath}`) // eslint-disable-line no-console
);

const stop = () => {
  server.close();
};

module.exports = app;
module.exports.stop = stop;
