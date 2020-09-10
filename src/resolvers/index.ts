import resolversUser from './user';
import resolversCardSet from './cardSet';
import resolversLearning from './learning';
import resolversPreRegisteredUser from './preRegisteredUser';

const resolvers = {
  Query: {
    ...resolversUser.query,
    ...resolversCardSet.query,
    ...resolversLearning.query,
    ...resolversPreRegisteredUser.query,
  },

  Mutation: {
    ...resolversUser.mutations,
    ...resolversCardSet.mutation,
    ...resolversLearning.mutations,
    ...resolversPreRegisteredUser.mutations,
  },
};

export default resolvers;
