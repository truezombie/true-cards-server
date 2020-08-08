import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type Query {
    me: User
    cardSets: [CardSet]
    cardSetWithCards(cardSetId: String!): CardSet

    getCurrentLearningCard: CurrentLearningCard
    resetLearningSession: String
    isExistLearningSession: Boolean
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

    startLearningSession(numberOfCards: Int!, cardSetId: String!, sessionType: String!): String
    setNextLearningCard(knowCurrentCard: Boolean!): String
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
    timesSuccess: Float
  }

  type CurrentLearningCard {
    front: String
    frontDescription: String
    back: String
    backDescription: String
    hasBackSide: Boolean
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
    timesSuccess: Float
  }

  type CardSet {
    id: ID!
    userId: ID!
    name: String!
    cardsMax: Int!
    cardsAll: Int!
    cards: [Card]
  }
`;

export default typeDefs;
