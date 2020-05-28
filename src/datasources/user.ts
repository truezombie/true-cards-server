import mongoose from 'mongoose';
import { AuthenticationError } from 'apollo-server-express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { InterfaceSchemaUser, SchemaUser } from '../db/schemas';
import config from '../utils/config';
import errorCodes from '../utils/error-codes';
import BaseDataSourceAPI from './BaseDataSource';

class UserAPI extends BaseDataSourceAPI {
  modelUser: mongoose.Model<InterfaceSchemaUser>;

  constructor(store) {
    super(store);

    this.modelUser = this.store.model('User', SchemaUser);
  }

  generateTokens = (user) => {
    const authToken = jwt.sign({ id: user._id }, config.jwtSalt, {
      expiresIn: config.jwtAuthTokenTimeLife,
    });

    const refreshToken = jwt.sign({ id: user._id }, config.jwtSalt, {
      expiresIn: config.jwtRefreshTokenTimeLife,
    });

    return {
      authToken,
      refreshToken,
    };
  };

  async regenerateTokens(data) {
    try {
      const payload = jwt.verify(data.token, config.jwtSalt);

      const user = await this.modelUser.findOne({ _id: payload.id });

      return this.generateTokens(user);
    } catch (e) {
      throw new AuthenticationError(errorCodes.ERROR_TOKEN_REFRESH_IS_NOT_VALID);
    }
  }

  async signIn(dataUser) {
    const user = await this.modelUser.findOne({ email: dataUser.email });
    const isPasswordValid = await bcrypt.compare(dataUser.password, (user && user.password) || '');

    if (!user || !isPasswordValid) {
      throw new AuthenticationError(errorCodes.ERROR_USER_NOT_EXIST);
    }

    return this.generateTokens(user);
  }

  async signUp(dataUser) {
    const existUser = await this.modelUser.findOne({ email: dataUser.email });
    const password = await bcrypt.hash(dataUser.password, config.bcryptRound);
    const NewUser = this.modelUser;
    const user = new NewUser({ ...dataUser, password });

    if (existUser) {
      throw new AuthenticationError(errorCodes.ERROR_USER_EXIST);
    } else {
      await user.save();
    }

    return this.generateTokens(user);
  }

  async me() {
    const userId = await this.isExistUser();
    const user = await this.modelUser.findOne({ _id: userId });

    return user;
  }
}

export default UserAPI;
