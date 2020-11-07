import resolverCard from './card';
import resolversUser from './user';
import resolversCardSet from './cardSet';
import resolversLearning from './learning';
import resolversPreRegisteredUser from './preRegisteredUser';

const resolvers = {
  Query: {
    ...resolverCard.query,
    ...resolversUser.query,
    ...resolversCardSet.query,
    ...resolversLearning.query,
    ...resolversPreRegisteredUser.query,
  },

  Mutation: {
    ...resolverCard.mutation,
    ...resolversUser.mutations,
    ...resolversCardSet.mutation,
    ...resolversLearning.mutations,
    ...resolversPreRegisteredUser.mutations,
  },
};

export default resolvers;
