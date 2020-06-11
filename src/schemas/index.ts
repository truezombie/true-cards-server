import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type Query {
    me: User
    cardSets: [CardSet]
    cardSetWithCards(cardSetId: String!): CardSet
    cardSetInfo(cardSetId: String!): CardSetInfo
  }

  type Mutation {
    generateTokens(token: String!): Tokens

    signIn(email: String!, password: String!): Tokens

    signUp(email: String!, password: String!, firstName: String!, lastName: String!): Tokens

    createCardSet(name: String!): String
    updateCardSet(cardSetId: String!, name: String!): String
    deleteCardSet(cardSetId: String!): String

    createCard(input: CardCreateInput!, cardSetId: String!): String
    updateCard(input: CardUpdateInput!, cardSetId: String!, uuid: String!): String
    deleteCard(cardUuid: String!, cardSetId: String!): String
  }

  type CardSetInfo {
    learned: Int!
    forgotten: Int!
    new: Int!
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

  input CardUpdateInput {
    front: String!
    frontDescription: String
    back: String
    backDescription: String
    hasBackSide: Boolean
  }

  input CardCreateInput {
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
    cardsMax: Int!
    cardsAll: Int!
    cardsLearned: Int!
    cardsForgotten: Int!
    cardsNew: Int!
    cards: [Card]
  }
`;

export default typeDefs;
