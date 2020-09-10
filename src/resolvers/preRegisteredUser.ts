const preRegisteredUser = {
  query: {},
  mutations: {
    setPreRegistrationEmail: async (_, { email }, { dataSources }) => {
      const response = await dataSources.preRegisteredUserAPI.setPreRegistrationEmail({
        email,
      });

      return response;
    },
  },
};

export default preRegisteredUser;
