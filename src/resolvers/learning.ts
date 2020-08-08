const resolversLearning = {
  query: {
    resetLearningSession: async (_, __, { dataSources }) => {
      const response = await dataSources.learningAPI.resetLearningSession();

      return response;
    },

    isExistLearningSession: async (_, __, { dataSources }) => {
      const response = await dataSources.learningAPI.isExistLearningSession();

      return response;
    },

    getCurrentLearningCard: async (_, __, { dataSources }) => {
      const response = await dataSources.learningAPI.getCurrentLearningCard();

      return response;
    },
  },
  mutations: {
    startLearningSession: async (_, { numberOfCards, cardSetId, sessionType }, { dataSources }) => {
      const response = await dataSources.learningAPI.startLearningSession(numberOfCards, cardSetId, sessionType);

      return response;
    },

    setNextLearningCard: async (_, { knowCurrentCard }, { dataSources }) => {
      const response = await dataSources.learningAPI.setNextLearningCard(knowCurrentCard);

      return response;
    },
  },
};

export default resolversLearning;
