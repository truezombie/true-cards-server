import moment from 'moment';

import { ModelSchemaCardSet } from '../db/schemas';
import BaseDataSourceAPI from './BaseDataSource';

class LearningAPI extends BaseDataSourceAPI {
  private SEED_OF_OBLIVION = 1;

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
    const { cards = [] } = await ModelSchemaCardSet.findOne({
      _id: cardSetId,
    });

    return {
      user,
      cards,
    };
  }

  async learnNewAndForgot(numberOfCards: number, cardSetId: string) {
    // TODO: check that I can create learning session maybe session is exist
    // TODO: check that cards folder can be empty
    const { cards } = await this.getCards(cardSetId);

    const learningSession = cards
      .filter((card) => {
        return this.isForgottenCard(card) || this.isNewCard(card);
      })
      .slice(0, numberOfCards)
      .map((card) => card.uuid);

    await ModelSchemaCardSet.updateOne({ _id: cardSetId }, { learningSession });

    return 'OK';
  }

  async learnNew(numberOfCards: number, cardSetId: string) {
    // TODO: check that I can create learning session maybe session is exist
    // TODO: check that cards folder can be empty
    const { cards } = await this.getCards(cardSetId);

    const learningSession = cards
      .filter((card) => {
        return this.isNewCard(card);
      })
      .slice(0, numberOfCards)
      .map((card) => card.uuid);

    await ModelSchemaCardSet.updateOne({ _id: cardSetId }, { learningSession });

    return 'OK';
  }

  async learnForgot(numberOfCards: number, cardSetId: string) {
    // TODO: check that I can create learning session maybe session is exist
    // TODO: check that cards folder can be empty
    const { cards } = await this.getCards(cardSetId);

    const learningSession = cards
      .filter((card) => {
        return this.isForgottenCard(card);
      })
      .slice(0, numberOfCards)
      .map((card) => card.uuid);

    await ModelSchemaCardSet.updateOne({ _id: cardSetId }, { learningSession });

    return 'OK';
  }

  async learnLearned(numberOfCards: number, cardSetId: string) {
    // TODO: check that I can create learning session maybe session is exist
    // TODO: check that cards folder can be empty
    const { cards } = await this.getCards(cardSetId);

    const learningSession = cards
      .filter((card) => {
        return this.isCardLearned(card);
      })
      .slice(0, numberOfCards)
      .map((card) => card.uuid);

    await ModelSchemaCardSet.updateOne({ _id: cardSetId }, { learningSession });

    return 'OK';
  }
}

export default LearningAPI;