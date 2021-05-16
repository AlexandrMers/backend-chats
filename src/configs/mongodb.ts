import Process from 'process';
import { MongooseModuleOptions } from '@nestjs/mongoose';

const getMongoDbUrl = (process: typeof Process) =>
  'mongodb://' +
  process.env.MONGO_LOGIN +
  ':' +
  process.env.MONGO_PASSWORD +
  '@' +
  process.env.MONGO_HOST +
  ':' +
  process.env.MONGO_PORT +
  '/' +
  process.env.MONGO_AUTHDATABASE;

const mongodbOptions: MongooseModuleOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
};

export { getMongoDbUrl, mongodbOptions };
