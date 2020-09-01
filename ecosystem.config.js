module.exports = {
  apps: [
    {
      name: 'true-cards-server',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        DB_USER: process.env.DB_USER,
        DB_PASSWORD: process.env.DB_PASSWORD,
        DB_HOST: process.env.DB_HOST,
        DB_NAME: process.env.DB_NAME,
        BCRYPT_ROUND: Number(process.env.BCRYPT_ROUND),
        JWT_SALT: process.env.JWT_SALT,
        JWT_TTL_AUTH_TOKEN: process.env.JWT_TTL_AUTH_TOKEN,
        JWT_TTL_REFRESH_TOKEN: process.env.JWT_TTL_REFRESH_TOKEN,
      },
    },
  ],
};
