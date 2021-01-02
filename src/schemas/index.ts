import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type Query {
    me: User
    cardSets(search: String!, page: Int, rowsPerPage: Int): CardSets

    getCurrentLearningCard: CurrentLearningCard
    resetLearningSession: String
    isExistLearningSession: Boolean

    cards(cardSetId: String!, search: String, page: Int, rowsPerPage: Int): CardsOutput
  }

  type Mutation {
    generateTokens(token: String!): Tokens

    signIn(email: String!, password: String!): Tokens

    signUp(linkUuid: String!, password: String!, firstName: String!, lastName: String!): Tokens
    resetPassword(confirmationKey: String!, password: String!): Tokens
    setPreRegistrationEmail(email: String!): String
    setResetPasswordVerifyKey(email: String!): String
    checkUserRegistrationLinkUuid(uuid: String!): String

    updateForgettingIndex(forgettingIndex: Int!): String
    updatePersonalData(firstName: String!, lastName: String!): String

    createCardSet(name: String!): String
    updateCardSetName(cardSetId: String!, name: String!): String
    updateCardSetShare(cardSetId: String!, isShared: Boolean!): String
    deleteCardSet(cardSetId: String!): String

    createCard(input: CardCreateInput!): String
    updateCard(input: CardUpdateInput!, cardId: String!): String
    deleteCard(cardId: String!): String

    startLearningSession(numberOfCards: Int!, cardSetId: String!, sessionType: String!): String
    setNextLearningCard(knowCurrentCard: Boolean!): String
  }

  type CardSets {
    cardSets: [CardSet]
    count: Int
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
    forgettingIndex: Int!
  }

  input CardUpdateInput {
    front: String!
    frontDescription: String
    back: String
    backDescription: String
    hasBackSide: Boolean
  }

  input CardCreateInput {
    cardSetId: String!
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
    index: Int
    from: Int
  }

  type Card {
    id: ID!
    cardSetId: String!
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
    isShared: Boolean!
    cards: [Card]
  }

  type CardSetWithCards {
    cardsAll: Int!
    cardSet: CardSet
  }

  type CardsOutput {
    count: Int!
    cards: [Card]
    cardSetId: String!
    cardSetName: String!
    cardsMax: Int!
  }
`;

export default typeDefs;
