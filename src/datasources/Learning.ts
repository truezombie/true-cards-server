import moment from 'moment';

import { ModelSchemaCardSet } from '../db/schemas';
import BaseDataSourceAPI from './BaseDataSource';

enum LEARNING_SESSION_TYPES {
  NEW_AND_FORGOT = 'NEW_AND_FORGOT',
  NEW = 'NEW',
  FORGOT = 'FORGOT',
  LEARNED = 'LEARNED',
}

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

  async startLearningSession(numberOfCards: number, cardSetId: string, sessionType: LEARNING_SESSION_TYPES) {
    // TODO: check that I can create learning session maybe session is exist
    // TODO: check that cards folder can be empty
    const { cards } = await this.getCards(cardSetId);

    const learningSession = cards
      .filter((card) => {
        switch (sessionType) {
          case LEARNING_SESSION_TYPES.NEW_AND_FORGOT:
            return this.isForgottenCard(card) || this.isNewCard(card);
          case LEARNING_SESSION_TYPES.NEW:
            return this.isNewCard(card);
          case LEARNING_SESSION_TYPES.FORGOT:
            return this.isForgottenCard(card);
          case LEARNING_SESSION_TYPES.LEARNED:
            return this.isCardLearned(card);
          default:
            return false;
        }
      })
      .slice(0, numberOfCards)
      .map((card) => card.uuid);

    await ModelSchemaCardSet.updateOne({ _id: cardSetId }, { learningSession });

    return 'OK';
  }
}

export default LearningAPI;
