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

    updateCardSetName: async (_, { cardSetId, name }, { dataSources }) => {
      const response = await dataSources.cardSetAPI.updateCardSetName(cardSetId, name);

      return response;
    },

    updateCardSetShare: async (_, { cardSetId, isShared }, { dataSources }) => {
      const response = await dataSources.cardSetAPI.updateCardSetShare(cardSetId, isShared);

      return response;
    },

    deleteCardSet: async (_, { cardSetId }, { dataSources }) => {
      const response = await dataSources.cardSetAPI.deleteCardSet(cardSetId);

      return response;
    },
  },
};

export default resolversCardsSet;
