import mongoose from 'mongoose';
import redis from 'redis';

import config from '../utils/config';

const dbPath = `mongodb://${config.dbUser}:${config.dbPassword}@${config.dbHost}:${config.dbPort}/${config.dbName}`;

const connectToMongoDb = async (cb) => {
  try {
    const db = await mongoose.connect(dbPath, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('MongoDB has been connected'); // eslint-disable-line no-console

    cb(db);
  } catch (err) {
    throw new Error(`Redis: connection failed ${err}`);
  }
};

const connectToRedis = () => {
  const redisClient = redis.createClient();

  redisClient.on('connect', () => {
    console.log(`Redis has been connected`);
  });

  redisClient.on('error', (err) => {
    throw new Error(`Redis: connection failed ${err}`);
  });

  return redisClient;
};

export { connectToMongoDb, connectToRedis };
