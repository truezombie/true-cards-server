import mongoose from 'mongoose';
import moment from 'moment';

import { InterfaceSchemaCardSet } from '../db/schemas';
import BaseDataSourceAPI from './BaseDataSource';

class LearningAPI extends BaseDataSourceAPI {
  private SEED_OF_OBLIVION = 1;

  modelCardSet: mongoose.Model<InterfaceSchemaCardSet>;

  isCardLearned = (card): boolean => {
    return moment(new Date()).isBefore(
      moment(card.timeLastSuccess).add(this.SEED_OF_OBLIVION * card.timeLastSuccess, 'd')
    );
  };

  isForgottenCard = (card) => {
    return !this.isCardLearned(card);
  };

  isNewCard = (card) => {
    return card.timesSuccess === 0;
  };

  async getCards(cardSetId: string) {
    const user = await this.isExistUser();
    const { cards = [] } = await this.modelCardSet.findOne({
      _id: cardSetId,
    });

    return {
      user,
      cards,
    };
  }

  // async learnNewAndForgot(redisClient, numberOfCards: number, cardSetId: string) {
  //   // TODO: check that I can create learning session

  //   const { cards, user } = await this.getCards(cardSetId);

  //   const filteredCards = cards
  //     .filter((card) => {
  //       return this.isForgottenCard(card) || this.isNewCard(card);
  //     })
  //     .slice(0, numberOfCards);
  // }

  // async learnNew(redisClient, numberOfCards: number, cardSetId: string) {
  //   // TODO: check that I can create learning session

  //   const { cards, user } = await this.getCards(cardSetId);

  //   const filteredCards = cards
  //     .filter((card) => {
  //       return this.isNewCard(card);
  //     })
  //     .slice(0, numberOfCards);
  // }

  // async learnForgot(redisClient, numberOfCards: number, cardSetId: string) {
  //   // TODO: check that I can create learning session

  //   const { cards, user } = await this.getCards(cardSetId);

  //   const filteredCards = cards
  //     .filter((card) => {
  //       return this.isForgottenCard(card);
  //     })
  //     .slice(0, numberOfCards);
  // }

  // async learnLearned(redisClient, numberOfCards: number, cardSetId: string) {
  //   // TODO: check that I can create learning session

  //   const { cards, user } = await this.getCards(cardSetId);

  //   const filteredCards = cards
  //     .filter((card) => {
  //       return this.isCardLearned(card);
  //     })
  //     .slice(0, numberOfCards);
  // }

  // async getActiveSession() {}
}

export default LearningAPI;
