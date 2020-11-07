const resolversCardsSet = {
  query: {
    cardSets: async (_, { search, page, rowsPerPage }, { dataSources }) => {
      const response = await dataSources.cardSetAPI.getCardSets(search, page, rowsPerPage);

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
  },
};

export default resolversCardsSet;
