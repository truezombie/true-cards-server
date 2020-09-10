import { AuthenticationError } from 'apollo-server-express';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import { ModelUser } from '../db/schemas';
import config from '../utils/config';
import ERROR_CODES from '../utils/error-codes';
import { getForgotPasswordEmail } from '../utils/emails';
import BaseDataSourceAPI from './BaseDataSource';

class UserAPI extends BaseDataSourceAPI {
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
      const user = await ModelUser.findOne({ _id: payload.id });

      return this.generateTokens(user);
    } catch (e) {
      throw new AuthenticationError(ERROR_CODES.ERROR_TOKEN_REFRESH_IS_NOT_VALID);
    }
  }

  async signIn(dataUser) {
    const user = await ModelUser.findOne({ email: dataUser.email });
    const isPasswordValid = await bcrypt.compare(dataUser.password, (user && user.password) || '');

    if (!user || !isPasswordValid) {
      throw new AuthenticationError(ERROR_CODES.ERROR_USER_NOT_EXIST);
    }

    return this.generateTokens(user);
  }

  async signUp(dataUser) {
    const existUser = await ModelUser.findOne({ email: dataUser.email });
    const password = await bcrypt.hash(dataUser.password, config.bcryptRound);
    const NewUser = ModelUser;
    const user = new NewUser({ ...dataUser, password });

    if (existUser) {
      throw new AuthenticationError(ERROR_CODES.ERROR_USER_EXIST);
    } else {
      await user.save();
    }

    return this.generateTokens(user);
  }

  async me() {
    const userId = await this.isExistUser();
    const user = await ModelUser.findOne({ _id: userId });

    return user;
  }

  async resetPassword({ confirmationKey, password }) {
    const existUser = await ModelUser.findOne({ passwordResetConfirmationKey: confirmationKey });
    const bCryptedPassword = await bcrypt.hash(password, config.bcryptRound);

    if (!existUser) {
      throw new AuthenticationError(ERROR_CODES.CONFIRMATION_KEY_IS_NOT_CORRECT);
    } else {
      await ModelUser.updateOne(
        { passwordResetConfirmationKey: confirmationKey },
        { password: bCryptedPassword, passwordResetConfirmationKey: '' }
      );
    }

    return this.generateTokens(existUser);
  }

  async setResetPasswordVerifyKey({ email }) {
    const existUser = await ModelUser.findOne({ email });

    if (!existUser) {
      throw new AuthenticationError(ERROR_CODES.ERROR_USER_NOT_EXIST);
    } else {
      const passwordResetConfirmationKey = uuidv4();

      await ModelUser.updateOne({ email }, { passwordResetConfirmationKey });

      await this.transporter.sendMail(
        getForgotPasswordEmail(existUser.firstName, existUser.lastName, existUser.email, passwordResetConfirmationKey)
      );
    }

    return 'OK';
  }
}

export default UserAPI;
