const preRegisteredUser = {
  query: {},
  mutations: {
    setPreRegistrationEmail: async (_, { email }, { dataSources }) => {
      const response = await dataSources.preRegisteredUserAPI.setPreRegistrationEmail({
        email,
      });

      return response;
    },

    checkUserRegistrationLinkUuid: async (_, { uuid }, { dataSources }) => {
      const response = await dataSources.preRegisteredUserAPI.checkUserRegistrationLinkUuid({
        uuid,
      });

      return response;
    },
  },
};

export default preRegisteredUser;
