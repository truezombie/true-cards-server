import dotenv from 'dotenv';

dotenv.config();

const config = {
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD,
  dbHost: process.env.DB_HOST,
  dbName: process.env.DB_NAME,
  bcryptRound: Number(process.env.BCRYPT_ROUND),
  jwtSalt: process.env.JWT_SALT,
  jwtAuthTokenTimeLife: process.env.JWT_TTL_AUTH_TOKEN,
  jwtRefreshTokenTimeLife: process.env.JWT_TTL_REFRESH_TOKEN,
  emailAddress: process.env.EMAIL_ADDRESS,
  emailPassword: process.env.EMAIL_PASSWORD,
};

export default config;
