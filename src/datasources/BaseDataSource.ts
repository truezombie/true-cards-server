import { DataSource } from 'apollo-datasource';
import jwt from 'jsonwebtoken';
import { AuthenticationError } from 'apollo-server-express';
import nodemailer from 'nodemailer';
import { Mongoose } from 'mongoose';

import config from '../utils/config';
import ERROR_CODES from '../utils/error-codes';

class BaseDataSourceAPI extends DataSource {
  public context: {
    token: string;
    mongoClient: Mongoose;
  };

  initialize(conf) {
    this.context = conf.context;
  }

  transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    auth: {
      user: config.emailAddress.replace('@gmail.com', ''),
      pass: config.emailPassword,
    },
  });

  async isExistUser() {
    try {
      const tokenPayload = await jwt.verify(this.context.token, config.jwtSalt);

      return tokenPayload.id;
    } catch (e) {
      throw new AuthenticationError(ERROR_CODES.ERROR_TOKEN_AUTH_IS_NOT_VALID);
    }
  }
}

export default BaseDataSourceAPI;
