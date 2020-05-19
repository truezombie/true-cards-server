import mongoose, { Mongoose } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
import { ApolloError } from 'apollo-server-express';
import { DataSource } from 'apollo-datasource';
import { InterfaceSchemaCardSet, InterfaceCard, SchemaCardSet } from '../db/schemas';
import errorCodes from '../utils/error-codes';
import { Context } from '../types';

class CardSetAPI extends DataSource {
  store: Mongoose;

  context: Context;

  modelCardSet: mongoose.Model<InterfaceSchemaCardSet>;

  constructor({ store }) {
    super();

    this.context = { userId: '' };

    this.store = store;

    this.modelCardSet = this.store.model('CardSet', SchemaCardSet);
  }

  initialize(conf) {
    this.context = conf.context;
  }

  async getCardSets() {
    const allCardSets = await this.modelCardSet.find({
      userId: this.context.userId,
    });

    return allCardSets;
  }

  async getCards(cardSetId: string) {
    const cardSet = await this.modelCardSet.findOne({
      _id: cardSetId,
    });

    return cardSet.cards;
  }

  async createCardSet(data: InterfaceSchemaCardSet) {
    // TODO: need to validate name field
    // TODO: need to return some cardSets not all

    const existCardSet = await this.modelCardSet.findOne({ name: data.name });
    const NewCardSet = this.modelCardSet;

    if (existCardSet) {
      throw new ApolloError('Card set exist', errorCodes.ERROR_CARD_SET_EXIST);
    } else {
      const cardSet = new NewCardSet({
        userId: this.context.userId,
        name: data.name,
        cards: [],
      });

      await cardSet.save();
    }

    const cardSets = await this.getCardSets();

    return cardSets;
  }

  async deleteCardSet(cardSetId: string) {
    await this.modelCardSet.deleteOne({ _id: cardSetId });

    const cardSets = await this.getCardSets();

    return cardSets;
  }

  async createCard(data: InterfaceCard, cardSetId: string) {
    // TODO: need to validate front field
    // TODO: need to validate back field
    // TODO: need to validate frontDescription field
    // TODO: need to validate backDescription field
    // TODO: max cards for 1 set 200

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

    await this.modelCardSet.updateOne({ _id: cardSetId }, { $push: { cards: { ...predefinedCard, ...data } } });

    const cards = await this.getCards(cardSetId);

    return cards;
  }

  async deleteCard(cardUuid: string, cardSetId: string) {
    await this.modelCardSet.updateOne({ _id: cardSetId }, { $pull: { cards: { uuid: cardUuid } } });

    const cards = await this.getCards(cardSetId);

    return cards;
  }
}

export default CardSetAPI;
