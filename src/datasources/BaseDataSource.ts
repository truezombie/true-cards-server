import { DataSource } from 'apollo-datasource';
import jwt from 'jsonwebtoken';
import { AuthenticationError } from 'apollo-server-express';
import { Mongoose } from 'mongoose';

import config from '../utils/config';
import errorCodes from '../utils/error-codes';

class BaseDataSourceAPI extends DataSource {
  public context: {
    token: string;
    mongoClient: Mongoose;
  };

  initialize(conf) {
    this.context = conf.context;
  }

  async isExistUser() {
    try {
      const tokenPayload = await jwt.verify(this.context.token, config.jwtSalt);

      return tokenPayload.id;
    } catch (e) {
      throw new AuthenticationError(errorCodes.ERROR_TOKEN_AUTH_IS_NOT_VALID);
    }
  }
}

export default BaseDataSourceAPI;