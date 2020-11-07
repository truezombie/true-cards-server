const resolversCards = {
  query: {
    cards: async (_, { cardSetId, search, page, rowsPerPage }, { dataSources }) => {
      const response = await dataSources.cardAPI.getCards(cardSetId, search, page, rowsPerPage);

      return response;
    },
  },
  mutation: {
    createCard: async (_, { input }, { dataSources }) => {
      const response = await dataSources.cardAPI.createCard(input);

      return response;
    },

    updateCard: async (_, { input, cardId }, { dataSources }) => {
      const response = await dataSources.cardAPI.updateCard(input, cardId);

      return response;
    },

    deleteCard: async (_, { cardId }, { dataSources }) => {
      const response = await dataSources.cardAPI.deleteCard(cardId);

      return response;
    },
  },
};

export default resolversCards;
