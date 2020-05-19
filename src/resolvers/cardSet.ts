const resolversCardsSet = {
  query: {
    cardSets: async (_, __, { dataSources }) => {
      const cardsSets = await dataSources.cardSetAPI.getCardSets();

      return cardsSets;
    },

    cards: async (_, { cardSetId }, { dataSources }) => {
      const cardsSets = await dataSources.cardSetAPI.getCards(cardSetId);

      return cardsSets;
    },
  },
  mutation: {
    createCardSet: async (_, { name }, { dataSources }) => {
      const cardsSets = await dataSources.cardSetAPI.createCardSet({ name });

      return cardsSets;
    },

    deleteCardSet: async (_, { cardSetId }, { dataSources }) => {
      const cardsSets = await dataSources.cardSetAPI.deleteCardSet(cardSetId);

      return cardsSets;
    },

    createCard: async (_, { input, cardSetId }, { dataSources }) => {
      const cards = await dataSources.cardSetAPI.createCard(input, cardSetId);

      return cards;
    },

    deleteCard: async (_, { cardUuid, cardSetId }, { dataSources }) => {
      const cards = await dataSources.cardSetAPI.deleteCard(cardUuid, cardSetId);

      return cards;
    },
  },
};

export default resolversCardsSet;
