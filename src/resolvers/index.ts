import resolverCard from './card';
import resolversUser from './user';
import resolversCardSet from './cardSet';
import resolversLearning from './learning';
import resolversProgress from './progress';
import resolversSharedCardsSet from './sharedCardSet';
import resolversPreRegisteredUser from './preRegisteredUser';

const resolvers = {
  Query: {
    ...resolverCard.query,
    ...resolversUser.query,
    ...resolversCardSet.query,
    ...resolversLearning.query,
    ...resolversProgress.query,
    ...resolversSharedCardsSet.query,
    ...resolversPreRegisteredUser.query,
  },

  Mutation: {
    ...resolverCard.mutation,
    ...resolversUser.mutations,
    ...resolversCardSet.mutation,
    ...resolversLearning.mutations,
    ...resolversProgress.mutations,
    ...resolversSharedCardsSet.mutations,
    ...resolversPreRegisteredUser.mutations,
  },
};

export default resolvers;
