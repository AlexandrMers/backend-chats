import Process from 'process';
import { MongooseModuleOptions } from '@nestjs/mongoose';

const getMongoDbUrl = (process: typeof Process) =>
  'mongodb://' +
  process.env.MONGO_DB_LOGIN +
  ':' +
  process.env.MONGO_DB_PASSWORD +
  '@' +
  process.env.MONGO_DB_HOST +
  ':' +
  process.env.MONGO_DB_PORT +
  '/' +
  process.env.MONGO_DB_AUTHDATABASE;

const mongodbOptions: MongooseModuleOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
};

export { getMongoDbUrl, mongodbOptions };
