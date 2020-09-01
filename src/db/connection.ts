import mongoose from 'mongoose';

import config from '../utils/config';

console.log(config, process.env);
const dbPath = `mongodb+srv://${config.dbUser}:${config.dbPassword}@${config.dbHost}/${config.dbName}?retryWrites=true&w=majority`;

const connectToMongoDb = async () => {
  try {
    const db = await mongoose.connect(dbPath, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('MongoDB has been connected'); // eslint-disable-line no-console

    return db;
  } catch (err) {
    throw new Error(`MongoDB: connection failed ${err}`);
  }
};

export default connectToMongoDb;
