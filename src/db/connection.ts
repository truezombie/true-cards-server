import mongoose from 'mongoose';

import config from '../utils/config';

const dbPath = `mongodb://${config.dbUser}:${config.dbPassword}@${config.dbHost}:${config.dbPort}/${config.dbName}`;

const connectToDb = async cb => {
  try {
    const db = await mongoose.connect(dbPath, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Data base connected'); // eslint-disable-line no-console

    cb(db);
  } catch (e) {
    console.error(e); // eslint-disable-line no-console
  }
};

export default connectToDb;
