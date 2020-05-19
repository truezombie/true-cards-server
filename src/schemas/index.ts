import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type Query {
    hello: String
    me: User
    cardSets: [CardSet]
    cards(cardSetId: String!): [Card]
  }

  type Mutation {
    generateTokens(token: String!): Tokens

    signIn(email: String!, password: String!): Tokens

    signUp(email: String!, password: String!, firstName: String!, lastName: String!): Tokens

    createCardSet(name: String!): [CardSet]
    deleteCardSet(cardSetId: String!): [CardSet]

    createCard(input: CardInput!, cardSetId: String!): [Card]
    deleteCard(cardUuid: String!, cardSetId: String!): [Card]
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

  input CardInput {
    front: String!
    frontDescription: String
    back: String
    backDescription: String
    hasBackSide: Boolean
    timeAdded: Float
    timeLastSuccess: Float
    timeLastFailed: Float
    timesFailed: Float
    timesSuccess: Float
  }

  type Card {
    id: ID!
    uuid: ID!
    front: String!
    frontDescription: String
    back: String
    backDescription: String
    hasBackSide: Boolean
    timeAdded: Float
    timeLastSuccess: Float
    timeLastFailed: Float
    timesFailed: Float
    timesSuccess: Float
  }

  type CardSet {
    id: ID!
    userId: ID!
    name: String!
    cards: [Card]
  }
`;

export default typeDefs;
