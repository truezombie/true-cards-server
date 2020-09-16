const resolversUser = {
  query: {
    me: async (_, __, { dataSources }) => {
      const me = await dataSources.userAPI.me();

      return me;
    },
  },
  mutations: {
    generateTokens: async (_, { token }, { dataSources }) => {
      const tokens = await dataSources.userAPI.regenerateTokens({ token });

      return tokens;
    },

    signIn: async (_, { email, password }, { dataSources }) => {
      const tokens = await dataSources.userAPI.signIn({
        email,
        password,
      });

      return tokens;
    },

    signUp: async (_, { linkUuid, password, firstName, lastName }, { dataSources }) => {
      const tokens = await dataSources.userAPI.signUp({
        linkUuid,
        password,
        firstName,
        lastName,
      });

      return tokens;
    },

    resetPassword: async (_, { confirmationKey, password }, { dataSources }) => {
      const tokens = await dataSources.userAPI.resetPassword({
        confirmationKey,
        password,
      });

      return tokens;
    },

    setResetPasswordVerifyKey: async (_, { email }, { dataSources }) => {
      const response = await dataSources.userAPI.setResetPasswordVerifyKey({
        email,
      });

      return response;
    },
  },
};

export default resolversUser;
