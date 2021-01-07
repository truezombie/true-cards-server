import { ApolloError } from 'apollo-server-express';

import { InterfaceSchemaCardSet, ModelSchemaCard, ModelSchemaCardSet, ModelSubscription } from '../db/schemas';
import ERROR_CODES from '../utils/error-codes';
import BaseDataSourceAPI from './BaseDataSource';

import { DEFAULT_MAX_CARDS_IN_CARD_SET, DEFAULT_MAX_CARD_SETS } from '../constants/app';

class CardSetAPI extends BaseDataSourceAPI {
  async getCardSets(search, page, rowsPerPage) {
    const userId = await this.isExistUser();
    // TODO: need to refactor

    const subscriptions = await ModelSubscription.find({
      userId,
    });

    const subscriptionsIds = subscriptions.map((subscription) => subscription.cardSetId);

    const count = await ModelSchemaCardSet.find({
      userId,
      name: { $regex: search },
    }).countDocuments({ userId });

    const allCardSets = await ModelSchemaCardSet.find({
      $or: [{ _id: subscriptionsIds }, { userId }],
      name: { $regex: search },
    })
      .limit(rowsPerPage)
      .skip(page * rowsPerPage);

    const cardSets = allCardSets.map((item) => {
      return {
        id: item._id,
        name: item.name,
        userId: item.userId,
        isShared: item.isShared,
        cardsMax: item.cardsMax,
      };
    });

    return {
      cardSets,
      count,
    };
  }

  async createCardSet(data: InterfaceSchemaCardSet) {
    // TODO: need to validate name field
    // TODO: need to return some cardSets not all

    const userId = await this.isExistUser();
    const existCardSet = await ModelSchemaCardSet.findOne({ name: data.name, userId });
    const allCardSets = await ModelSchemaCardSet.find({
      userId,
    });
    const NewCardSet = ModelSchemaCardSet;

    if (existCardSet) {
      throw new ApolloError(ERROR_CODES.ERROR_CARD_SET_EXIST);
    }

    if (allCardSets?.length + 1 >= DEFAULT_MAX_CARD_SETS) {
      throw new ApolloError(ERROR_CODES.ERROR_EXCEEDED_LIMIT_CARDS_SETS);
    }

    const cardSet = new NewCardSet({
      userId,
      name: data.name,
      isShared: false,
      cardsMax: DEFAULT_MAX_CARDS_IN_CARD_SET,
    });

    await cardSet.save();

    return 'OK';
  }

  async updateCardSetName(cardSetId: string, name: string) {
    await this.isExistUser();

    // TODO: validation if cardSet is not exist

    await ModelSchemaCardSet.findOneAndUpdate({ _id: cardSetId }, { $set: { name } });

    return 'OK';
  }

  async updateCardSetShare(cardSetId: string, isShared: boolean) {
    await this.isExistUser();

    // TODO: validation if cardSet is not exist

    await ModelSchemaCardSet.findOneAndUpdate({ _id: cardSetId }, { $set: { isShared } });
    return 'OK';
  }

  async deleteCardSet(cardSetId: string) {
    await this.isExistUser();
    await ModelSchemaCardSet.deleteOne({ _id: cardSetId });
    await ModelSchemaCard.deleteMany({ cardSetId });

    return 'OK';
  }
}

export default CardSetAPI;
