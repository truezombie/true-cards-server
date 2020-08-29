import mongoose from 'mongoose';

import config from '../utils/config';

const dbPath = `mongodb+srv://${config.dbUser}:${config.dbPassword}@${config.dbHost}/${config.dbName}?retryWrites=true&w=majority`;

const connectToMongoDb = async cb => {
  try {
    const db = await mongoose.connect(dbPath, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('MongoDB has been connected'); // eslint-disable-line no-console

    return cb(db);
  } catch (err) {
    throw new Error(`MongoDB: connection failed ${err}`);
  }
};

export default connectToMongoDb;
