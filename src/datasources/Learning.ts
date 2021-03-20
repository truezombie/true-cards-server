import moment from 'moment';
import { ApolloError } from 'apollo-server-express';

import { ModelSchemaCard, ModelUser, ModelProgress, InterfaceProgress, InterfaceCard } from '../db/schemas';
import BaseDataSourceAPI from './BaseDataSource';
import ERROR_CODES from '../utils/error-codes';

// eslint-disable-next-line no-shadow
enum LEARNING_SESSION_TYPES {
  NEW_AND_FORGOT = 'NEW_AND_FORGOT',
  NEW = 'NEW',
  FORGOT = 'FORGOT',
  LEARNED = 'LEARNED',
}

type CardsWithProgresses = InterfaceCard & { progress: InterfaceProgress[] };
class LearningAPI extends BaseDataSourceAPI {
  private SEED_OF_OBLIVION = 1;

  getCardProgress = (card: CardsWithProgresses): InterfaceProgress | undefined => {
    return card.progress[0];
  };

  isCardLearned = (card: CardsWithProgresses): boolean => {
    const progress = this.getCardProgress(card);

    if (progress) {
      return moment(new Date()).isBefore(
        moment(progress.timeLastSuccess).add(this.SEED_OF_OBLIVION * progress.timesSuccess, 'd')
      );
    }

    return false;
  };

  isForgottenCard = (card: CardsWithProgresses): boolean => {
    return !this.isNewCard(card) && !this.isCardLearned(card);
  };

  isNewCard = (card: CardsWithProgresses): boolean => {
    return this.getCardProgress(card) === undefined;
  };

  async startLearningSession(numberOfCards: number, cardSetId: string, sessionType: LEARNING_SESSION_TYPES) {
    // TODO: check that I can create learning session maybe session is exist
    // TODO: check that cards folder can be empty
    const userId = await this.isExistUser();

    const cards = await ModelSchemaCard.aggregate<CardsWithProgresses>([
      {
        $match: {
          cardSetId,
        },
      },
      {
        $addFields: { id: '$_id' },
      },
      {
        $lookup: {
          from: 'progresses',
          let: { id: '$_id' },
          as: 'progress',
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$userId', userId] },
                    { $eq: ['$cardSetId', cardSetId] },
                    { $eq: [{ $toObjectId: '$cardId' }, '$$id'] },
                  ],
                },
              },
            },
          ],
        },
      },
    ]);

    const { learningSession: learningCardsArrayIds } = await ModelUser.findOne({
      _id: userId,
    });

    if (learningCardsArrayIds.length !== 0) {
      throw new ApolloError(ERROR_CODES.ERROR_LEARNING_SESSION_ALREADY_EXIST);
    }

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
      .map((card) => card.id);

    await ModelUser.updateOne(
      { _id: userId },
      {
        learningSession,
        learningSessionCardSetId: cardSetId,
        learningSessionCurrentCardIndex: 0,
      }
    );

    return 'OK';
  }

  async getCurrentLearningCard() {
    const userId = await this.isExistUser();

    const { learningSession, learningSessionCardSetId, learningSessionCurrentCardIndex } = await ModelUser.findOne({
      _id: userId,
    });

    if (learningSession.length === 0) {
      throw new ApolloError(ERROR_CODES.ERROR_LEARNING_SESSION_IS_NOT_EXIST);
    }

    const cards = await ModelSchemaCard.find({ cardSetId: learningSessionCardSetId });

    const currentCardId = learningSession[learningSessionCurrentCardIndex];
    const currentCard = cards.find((card) => currentCardId === card.id);

    if (learningSessionCurrentCardIndex >= learningSession.length) {
      await ModelUser.updateOne(
        { _id: userId },
        {
          learningSession: [],
          learningSessionCardSetId: '',
          learningSessionCurrentCardIndex: 0,
        }
      );

      throw new ApolloError(ERROR_CODES.ERROR_OUT_OF_CARDS);
    }

    if (!currentCard) {
      throw new ApolloError(ERROR_CODES.ERROR_CARD_IS_NOT_EXIST);
    }

    return {
      front: currentCard.front,
      frontDescription: currentCard.frontDescription,
      back: currentCard.back,
      backDescription: currentCard.backDescription,
      hasBackSide: currentCard.hasBackSide,
      index: learningSessionCurrentCardIndex,
      from: learningSession.length,
    };
  }

  async setNextLearningCard(knowCurrentCard: boolean) {
    const userId = await this.isExistUser();
    const { learningSessionCurrentCardIndex, learningSessionCardSetId, learningSession } = await ModelUser.findOne({
      _id: userId,
    });

    const currentCardId = learningSession[learningSessionCurrentCardIndex];
    const currentCardFindingPattern = {
      userId,
      cardId: currentCardId,
      cardSetId: learningSessionCardSetId,
    };

    const progressForCurrentCard = await ModelProgress.findOne(currentCardFindingPattern);

    const progressPayload = {
      cardSetId: learningSessionCardSetId,
      cardId: currentCardId,
      userId,
      timeLastSuccess: knowCurrentCard ? moment().valueOf() : 0,
      timesSuccess: knowCurrentCard ? (progressForCurrentCard?.timesSuccess || 0) + 1 : 0,
    };

    if (progressForCurrentCard) {
      await ModelProgress.updateOne(currentCardFindingPattern, progressPayload);
    } else {
      const newProgressForCurrentCard = new ModelProgress(progressPayload);

      await newProgressForCurrentCard.save();
    }

    await ModelUser.updateOne(
      { _id: userId },
      { learningSessionCurrentCardIndex: learningSessionCurrentCardIndex + 1 }
    );

    return 'OK';
  }

  async resetLearningSession() {
    const userId = await this.isExistUser();

    await ModelUser.updateOne(
      { _id: userId },
      {
        learningSession: [],
        learningSessionCardSetId: '',
        learningSessionCurrentCardIndex: 0,
      }
    );

    return 'OK';
  }

  async isExistLearningSession() {
    const userId = await this.isExistUser();
    const { learningSession } = await ModelUser.findOne({ _id: userId });

    return learningSession.length !== 0;
  }
}

export default LearningAPI;
