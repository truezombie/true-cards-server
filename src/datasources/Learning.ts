import moment from 'moment';
import { ApolloError } from 'apollo-server-express';

import { ModelSchemaCardSet } from '../db/schemas';
import BaseDataSourceAPI from './BaseDataSource';
import errorCodes from '../utils/error-codes';

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

    await ModelSchemaCardSet.updateOne({ _id: cardSetId }, { learningSession, currentLearningIndex: 0 });

    return 'OK';
  }

  async getCurrentLearningCard(cardSetId: string) {
    await this.isExistUser();

    const { currentLearningIndex, learningSession, cards } = await ModelSchemaCardSet.findOne({ _id: cardSetId });
    const currentCardId = learningSession[currentLearningIndex];
    const currentCard = cards.find((card) => currentCardId === card.uuid);

    if (currentLearningIndex > learningSession.length) {
      throw new ApolloError(errorCodes.ERROR_OUT_OF_CARD);
    }

    if (!currentCard) {
      throw new ApolloError(errorCodes.ERROR_CARD_IS_NOT_EXIST);
    }

    return {
      front: currentCard.front,
      frontDescription: currentCard.frontDescription,
      back: currentCard.back,
      backDescription: currentCard.backDescription,
      hasBackSide: currentCard.hasBackSide,
    };
  }

  async setNextLearningCard(cardSetId: string, konwCurrentCard: boolean) {
    await this.isExistUser();

    const { currentLearningIndex } = await ModelSchemaCardSet.findOne({ _id: cardSetId });

    await ModelSchemaCardSet.updateOne({ _id: cardSetId }, { currentLearningIndex: currentLearningIndex + 1 });

    return 'OK';
  }
}

export default LearningAPI;
