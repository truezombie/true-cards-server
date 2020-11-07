import express from 'express';
import { ApolloServer } from 'apollo-server-express';

import typeDefs from './schemas';
import resolvers from './resolvers';

import { UserAPI, CardSetAPI, LearningAPI, PreRegisteredUserAPI, CardAPI } from './datasources';

import connectToMongoDb from './db/connection';

const PORT = 3000;

const app = express();
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
    cardAPI: new CardAPI(),
    cardSetAPI: new CardSetAPI(),
    learningAPI: new LearningAPI(),
    preRegisteredUserAPI: new PreRegisteredUserAPI(),
  }),
});

apolloServer.applyMiddleware({ app });

const server = app.listen(
  { port: PORT },
  () => console.log(`Server ready at http://localhost:${PORT}${apolloServer.graphqlPath}`) // eslint-disable-line no-console
);

const stop = () => {
  server.close();
};

module.exports = app;
module.exports.stop = stop;
