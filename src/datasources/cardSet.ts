import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
import { ApolloError } from 'apollo-server-express';
import { InterfaceSchemaCardSet, InterfaceCard, SchemaCardSet } from '../db/schemas';
import errorCodes from '../utils/error-codes';
import BaseDataSourceAPI from './BaseDataSource';

class CardSetAPI extends BaseDataSourceAPI {
  modelCardSet: mongoose.Model<InterfaceSchemaCardSet>;

  constructor(store) {
    super(store);

    this.modelCardSet = this.store.model('CardSet', SchemaCardSet);
  }

  async getCardSets() {
    const userId = await this.isExistUser();
    const allCardSets = await this.modelCardSet.find({
      userId,
    });

    return allCardSets;
  }

  async getCardSetWithCards(cardSetId: string) {
    await this.isExistUser();
    const cardSet = await this.modelCardSet.findOne({
      _id: cardSetId,
    });

    return cardSet;
  }

  async createCardSet(data: InterfaceSchemaCardSet) {
    // TODO: need to validate name field
    // TODO: need to return some cardSets not all

    const userId = await this.isExistUser();
    const existCardSet = await this.modelCardSet.findOne({ name: data.name, userId });
    const NewCardSet = this.modelCardSet;

    if (existCardSet) {
      throw new ApolloError(errorCodes.ERROR_CARD_SET_EXIST);
    } else {
      const cardSet = new NewCardSet({
        userId,
        name: data.name,
        cardsMax: 50,
        cardsAll: 2,
        cardsLearned: 12,
        cardsForgotten: 33,
        cardsNew: 12,
        cards: [],
      });

      await cardSet.save();
    }

    return 'OK';
  }

  async updateCardSet(cardSetId: string, name: string) {
    await this.modelCardSet.findOneAndUpdate({ _id: cardSetId }, { $set: { name } });

    return 'OK';
  }

  async deleteCardSet(cardSetId: string) {
    await this.isExistUser();
    await this.modelCardSet.deleteOne({ _id: cardSetId });

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
      timeLastFailed: 0,
      timesFailed: 0,
      timesSuccess: 0,
    };

    await this.modelCardSet.updateOne({ _id: cardSetId }, { $push: { cards: { ...predefinedCard, ...input } } });

    return 'OK';
  }

  async updateCard(input: InterfaceCard, cardSetId: string, uuid: string) {
    await this.modelCardSet.findOneAndUpdate(
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
    await this.modelCardSet.updateOne({ _id: cardSetId }, { $pull: { cards: { uuid: cardUuid } } });

    return 'OK';
  }
}

export default CardSetAPI;
