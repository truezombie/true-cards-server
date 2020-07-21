import { v4 as uuidv4 } from 'uuid';
import { ApolloError } from 'apollo-server-express';
import moment from 'moment';

import { InterfaceSchemaCardSet, InterfaceCard, ModelSchemaCardSet } from '../db/schemas';
import errorCodes from '../utils/error-codes';
import BaseDataSourceAPI from './BaseDataSource';

import { DEFAULT_MAX_CARDS_IN_CARD_SET } from '../constants/app';

class CardSetAPI extends BaseDataSourceAPI {
  async getCardSets() {
    const userId = await this.isExistUser();
    const allCardSets = await ModelSchemaCardSet.find({
      userId,
    });

    return allCardSets.map((item) => {
      return {
        id: item._id,
        userId: item.userId,
        name: item.name,
        cardsMax: item.cardsMax,
        cardsAll: item.cards.length,
        cards: item.cards,
      };
    });
  }

  async getCardSetWithCards(cardSetId: string) {
    await this.isExistUser();
    const cardSet = await ModelSchemaCardSet.findOne({
      _id: cardSetId,
    });

    return cardSet;
  }

  async createCardSet(data: InterfaceSchemaCardSet) {
    // TODO: need to validate name field
    // TODO: need to return some cardSets not all

    const userId = await this.isExistUser();
    const existCardSet = await ModelSchemaCardSet.findOne({ name: data.name, userId });
    const NewCardSet = ModelSchemaCardSet;

    if (existCardSet) {
      throw new ApolloError(errorCodes.ERROR_CARD_SET_EXIST);
    } else {
      const cardSet = new NewCardSet({
        userId,
        name: data.name,
        cardsMax: DEFAULT_MAX_CARDS_IN_CARD_SET,
        cards: [],
      });

      await cardSet.save();
    }

    return 'OK';
  }

  async updateCardSet(cardSetId: string, name: string) {
    await this.isExistUser();
    await ModelSchemaCardSet.findOneAndUpdate({ _id: cardSetId }, { $set: { name } });

    return 'OK';
  }

  async deleteCardSet(cardSetId: string) {
    await this.isExistUser();
    await ModelSchemaCardSet.deleteOne({ _id: cardSetId });

    return 'OK';
  }

  async createCard(input: InterfaceCard, cardSetId: string) {
    await this.isExistUser();
    // TODO: need to validate front field
    // TODO: need to validate back field
    // TODO: need to validate frontDescription field
    // TODO: need to validate backDescription field
    // TODO: max cards for 1 set 50

    const predefinedCard: InterfaceCard = {
      uuid: uuidv4(),
      front: '',
      frontDescription: '',
      back: '',
      backDescription: '',
      hasBackSide: false,
      timeAdded: moment().valueOf(),
      timeLastSuccess: 0,
      timesSuccess: 0,
    };

    await ModelSchemaCardSet.updateOne({ _id: cardSetId }, { $push: { cards: { ...predefinedCard, ...input } } });

    return 'OK';
  }

  async updateCard(input: InterfaceCard, cardSetId: string, uuid: string) {
    await this.isExistUser();
    await ModelSchemaCardSet.findOneAndUpdate(
      { _id: cardSetId, cards: { $elemMatch: { uuid } } },
      {
        $set: {
          'cards.$.front': input.front,
          'cards.$.frontDescription': input.frontDescription,
          'cards.$.back': input.back,
          'cards.$.backDescription': input.backDescription,
          'cards.$.hasBackSide': input.hasBackSide,
        },
      }
    );

    return 'OK';
  }

  async deleteCard(cardUuid: string, cardSetId: string) {
    await this.isExistUser();
    await ModelSchemaCardSet.updateOne({ _id: cardSetId }, { $pull: { cards: { uuid: cardUuid } } });

    return 'OK';
  }
}

export default CardSetAPI;
