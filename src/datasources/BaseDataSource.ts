import { DataSource } from 'apollo-datasource';
import jwt from 'jsonwebtoken';
import { ApolloError } from 'apollo-server-express';
import { Mongoose } from 'mongoose';
import { Context } from '../types';

import config from '../utils/config';
import errorCodes from '../utils/error-codes';

class BaseDataSourceAPI extends DataSource {
  store: Mongoose;

  context: Context;

  constructor(store) {
    super();

    this.context = { token: '' };

    this.store = store;
  }

  initialize(conf) {
    this.context = conf.context;
  }

  async isExistUser() {
    try {
      const tokenPayload = await jwt.verify(this.context.token, config.jwtSalt);

      return tokenPayload.id;
    } catch (e) {
      throw new ApolloError(`Token doesn't valid`, errorCodes.ERROR_TOKEN_IS_NOT_VALID);
    }
  }
}

export default BaseDataSourceAPI;
