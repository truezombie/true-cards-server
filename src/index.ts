import express from 'express';
import jwt from 'jsonwebtoken';
import { ApolloError, ApolloServer } from 'apollo-server-express';
import config from './utils/config';
import errorCodes from './utils/error-codes';

import typeDefs from './schemas';
import resolvers from './resolvers';

import { UserAPI, CardSetAPI } from './datasources';

import connectToDb from './db/connection';

const getTokenPayload = async (token?: string) => {
  if (!token) return '';

  try {
    return await jwt.verify(token, config.jwtSalt);
  } catch (e) {
    throw new ApolloError(`Token doesn't valid`, errorCodes.ERROR_TOKEN_IS_NOT_VALID);
  }
};

const apolloServerStart = store => {
  const server = new ApolloServer({
    context: async ({ req }) => {
      const tokenPayload = await getTokenPayload(req.headers.authorization);

      return {
        userId: tokenPayload.id,
      };
    },
    typeDefs,
    resolvers,
    dataSources: () => ({
      userAPI: new UserAPI({ store }),
      cardSetAPI: new CardSetAPI({ store }),
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
