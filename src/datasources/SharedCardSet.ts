import { ApolloError } from 'apollo-server-express';
import mongoose from 'mongoose';

import { ModelSchemaCardSet, ModelSubscription } from '../db/schemas';
import ERROR_CODES from '../utils/error-codes';
import BaseDataSourceAPI from './BaseDataSource';

class SharedCardSetAPI extends BaseDataSourceAPI {
  async getSharedCardSets(search, page, rowsPerPage) {
    const userId = await this.isExistUser();

    const subscriptions = await ModelSubscription.find({
      userId,
    });

    const subscriptionsIds = subscriptions.map(({ cardSetId }) => cardSetId);

    const count = await ModelSchemaCardSet.find({
      isShared: true,
      name: { $regex: search },
      userId: { $ne: userId },
    }).countDocuments({ isShared: true });

    const allCardSets = await ModelSchemaCardSet.aggregate([
      {
        $match: {
          $and: [
            { isShared: true },
            { name: { $regex: search } },
            { userId: { $ne: mongoose.Types.ObjectId(userId) } },
          ],
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $limit: rowsPerPage,
      },
      {
        $skip: page * rowsPerPage,
      },
    ]);

    const cardSets = allCardSets.map((item) => {
      return {
        id: item._id,
        userId: item.userId,
        name: item.name,
        isShared: item.isShared,
        cardsMax: item.cardsMax,
        isSubscribed: subscriptionsIds,
        author: `${item.user[0].firstName} ${item.user[0].lastName}`,
      };
    });

    return {
      cardSets,
      subscriptions: subscriptionsIds,
      count,
    };
  }

  async setSubscription(cardSetId) {
    const userId = await this.isExistUser();

    const isSubscriptionExist = await ModelSubscription.findOne({
      userId,
      cardSetId,
    });

    if (isSubscriptionExist) {
      throw new ApolloError(ERROR_CODES.ERROR_SUBSCRIPTION_ALREADY_EXISTS); // TODO: need to add on front-end side
    }

    const subscription = new ModelSubscription({
      userId,
      cardSetId,
    });

    subscription.save();

    return 'OK';
  }

  async setUnsubscription(cardSetId) {
    const userId = await this.isExistUser();

    await ModelSubscription.deleteOne({ userId, cardSetId });

    // TODO: need to delete progress

    return 'OK';
  }
}

export default SharedCardSetAPI;
