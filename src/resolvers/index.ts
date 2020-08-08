import resolversUser from './user';
import resolversCardSet from './cardSet';
import resolversLearning from './learning';

const resolvers = {
  Query: {
    ...resolversUser.query,
    ...resolversCardSet.query,
    ...resolversLearning.query,
  },

  Mutation: {
    ...resolversUser.mutations,
    ...resolversCardSet.mutation,
    ...resolversLearning.mutations,
  },
};

export default resolvers;
