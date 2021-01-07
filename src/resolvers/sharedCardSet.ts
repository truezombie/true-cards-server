const resolversSharedCardsSet = {
  query: {
    sharedCardSets: async (_, { search, page, rowsPerPage }, { dataSources }) => {
      const response = await dataSources.sharedCardSetAPI.getSharedCardSets(search, page, rowsPerPage);

      return response;
    },
  },
  mutations: {
    setSubscription: async (_, { cardSetId }, { dataSources }) => {
      const response = await dataSources.sharedCardSetAPI.setSubscription(cardSetId);

      return response;
    },
    setUnSubscription: async (_, { cardSetId }, { dataSources }) => {
      const response = await dataSources.sharedCardSetAPI.setUnsubscription(cardSetId);

      return response;
    },
  },
};

export default resolversSharedCardsSet;
