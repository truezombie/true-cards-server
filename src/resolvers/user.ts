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
    signUp: async (_, { email, password, firstName, lastName }, { dataSources }) => {
      const tokens = await dataSources.userAPI.signUp({
        firstName,
        lastName,
        email,
        password,
      });

      return tokens;
    },
  },
};

export default resolversUser;
