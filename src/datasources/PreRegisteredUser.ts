import { AuthenticationError } from 'apollo-server-express';
import { v4 as uuidv4 } from 'uuid';

import { ModelUser, ModelPreRegisteredUser } from '../db/schemas';
import ERROR_CODES from '../utils/error-codes';
import BaseDataSourceAPI from './BaseDataSource';
import { getSignInEmail } from '../utils/emails';

class PreRegisteredUserAPI extends BaseDataSourceAPI {
  async setPreRegistrationEmail({ email }) {
    const existUser = await ModelUser.findOne({ email });

    if (existUser) {
      throw new AuthenticationError(ERROR_CODES.ERROR_USER_EXIST);
    } else {
      const currentLinkUuid = uuidv4();

      await ModelPreRegisteredUser.updateOne({ email }, { currentLinkUuid }, { upsert: true });
      await this.transporter.sendMail(getSignInEmail(email, currentLinkUuid));
    }

    return 'OK';
  }

  // eslint-disable-next-line class-methods-use-this
  async checkUserRegistrationLinkUuid({ uuid }) {
    const userWhoWaitingRegistration = await ModelPreRegisteredUser.findOne({
      currentLinkUuid: uuid,
    });

    if (!userWhoWaitingRegistration) {
      throw new AuthenticationError(ERROR_CODES.ERROR_PRE_REGISTERED_DATA_NOT_FOUND);
    }

    return 'OK';
  }
}

export default PreRegisteredUserAPI;
