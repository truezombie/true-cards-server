import { ApolloError } from 'apollo-server-express';
import moment from 'moment';

import { InterfaceCard, ModelSchemaCard, ModelSchemaCardSet, ModelSubscription } from '../db/schemas';
import ERROR_CODES from '../utils/error-codes';
import BaseDataSourceAPI from './BaseDataSource';

import { DEFAULT_MAX_CARDS_IN_CARD_SET } from '../constants/app';

const cardTemplate = {
  cardSetId: '',
  front: '',
  frontDescription: '',
  back: '',
  backDescription: '',
  hasBackSide: false,
  timeAdded: moment().valueOf(),
  timeLastSuccess: 0,
  timesSuccess: 0,
};

class CardAPI extends BaseDataSourceAPI {
  async getCards(cardSetId: string, search: string, page: number, rowsPerPage: number) {
    const userId = await this.isExistUser();

    try {
      const currentCardSetIsShared = await ModelSubscription.findOne({ cardSetId, userId });
      const currentCardSetIsMy = await ModelSchemaCardSet.findOne({ _id: cardSetId, userId });

      if (!currentCardSetIsShared && !currentCardSetIsMy) {
        throw new ApolloError(ERROR_CODES.ERROR_CARD_SET_NOT_FOUND);
      }

      const { name, cardsMax, id } = await ModelSchemaCardSet.findOne({
        _id: cardSetId,
        $or: [{ isShared: true }, { userId }],
      });

      const count = await ModelSchemaCard.find({
        cardSetId,
        $or: [{ front: { $regex: search } }, { back: { $regex: search } }],
      }).countDocuments({ cardSetId });

      const cards = await ModelSchemaCard.find({
        cardSetId,
        $or: [{ front: { $regex: search } }, { back: { $regex: search } }],
      })
        .limit(rowsPerPage)
        .skip(page * rowsPerPage);

      return {
        isFollowingCardSet: !!currentCardSetIsShared,
        cardSetId: id,
        cardSetName: name,
        cardsMax,
        cards,
        count,
      };
    } catch {
      throw new ApolloError(ERROR_CODES.ERROR_CARD_SET_NOT_FOUND);
    }
  }

  async createCard(cardInput: InterfaceCard) {
    await this.isExistUser();

    const cardsAmount = await ModelSchemaCard.find({
      cardSetId: cardInput.cardSetId,
    }).countDocuments({ cardSetId: cardInput.cardSetId });

    if (cardsAmount >= DEFAULT_MAX_CARDS_IN_CARD_SET) {
      throw new ApolloError(ERROR_CODES.ERROR_EXCEEDED_LIMIT_CARDS_IN_CARD_SET);
    }

    const NewCard = ModelSchemaCard;
    const card = new NewCard({
      ...cardTemplate,
      ...cardInput,
    });

    await card.save();

    return 'OK';
  }

  async updateCard(input: InterfaceCard, cardId: string) {
    await this.isExistUser();
    await ModelSchemaCard.findOneAndUpdate({ _id: cardId }, { $set: { ...input } });

    return 'OK';
  }

  async deleteCard(cardId: string) {
    await this.isExistUser();
    await ModelSchemaCard.deleteOne({ _id: cardId });

    return 'OK';
  }
}

export default CardAPI;
