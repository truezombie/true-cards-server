const resolversCardsSet = {
  query: {
    cardSets: async (_, { redisClient }, { dataSources }) => {
      console.log(redisClient);
      const response = await dataSources.cardSetAPI.getCardSets();

      return response;
    },

    cardSetWithCards: async (_, { cardSetId }, { dataSources }) => {
      const response = await dataSources.cardSetAPI.getCardSetWithCards(cardSetId);

      return response;
    },
  },
  mutation: {
    createCardSet: async (_, { name }, { dataSources }) => {
      const response = await dataSources.cardSetAPI.createCardSet({ name });

      return response;
    },

    updateCardSet: async (_, { cardSetId, name }, { dataSources }) => {
      const response = await dataSources.cardSetAPI.updateCardSet(cardSetId, name);

      return response;
    },

    deleteCardSet: async (_, { cardSetId }, { dataSources }) => {
      const response = await dataSources.cardSetAPI.deleteCardSet(cardSetId);

      return response;
    },

    createCard: async (_, { input, cardSetId }, { dataSources }) => {
      const response = await dataSources.cardSetAPI.createCard(input, cardSetId);

      return response;
    },

    updateCard: async (_, { input, cardSetId, uuid }, { dataSources }) => {
      const response = await dataSources.cardSetAPI.updateCard(input, cardSetId, uuid);

      return response;
    },

    deleteCard: async (_, { cardUuid, cardSetId }, { dataSources }) => {
      const response = await dataSources.cardSetAPI.deleteCard(cardUuid, cardSetId);

      return response;
    },
  },
};

export default resolversCardsSet;
