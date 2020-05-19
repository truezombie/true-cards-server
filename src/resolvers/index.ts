import resolversUser from './user';
import resolversCardSet from './cardSet';

const resolvers = {
  Query: {
    ...resolversUser.query,
    ...resolversCardSet.query,
  },

  Mutation: {
    ...resolversUser.mutations,
    ...resolversCardSet.mutation,
  },
};

export default resolvers;
