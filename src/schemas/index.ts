import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type Query {
    hello: String
    me: User
  }

  type Mutation {
    generateTokens(token: String!): Tokens

    signIn(email: String!, password: String!): Tokens

    signUp(
      email: String!
      password: String!
      firstName: String!
      lastName: String!
    ): Tokens
  }

  type Tokens {
    authToken: String!
    refreshToken: String!
  }

  type User {
    id: ID!
    email: String!
    firstName: String!
    lastName: String!
  }
`;

export default typeDefs;
