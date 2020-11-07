import { ApolloError } from 'apollo-server-express';
import moment from 'moment';

import { InterfaceCard, ModelSchemaCard, ModelSchemaCardSet } from '../db/schemas';
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
    await this.isExistUser();

    const { name, cardsMax } = await ModelSchemaCardSet.findOne({
      _id: cardSetId,
    });

    const count = await ModelSchemaCard.find({
      cardSetId,
    }).countDocuments({ cardSetId });

    const cards = await ModelSchemaCard.find({
      cardSetId,
      $or: [{ front: { $regex: search } }, { back: { $regex: search } }],
    })
      .limit(rowsPerPage)
      .skip(page * rowsPerPage);

    return {
      cardSetName: name,
      cardsMax,
      cards,
      count,
    };
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
