import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';

import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ChatsModule } from './chats/chats.module';
import { MessagesModule } from './chats/messages.module';
import { SocketModule } from './socket/socket.module';
import { AppGateway } from './app.gateway';

const mongodbOptions: MongooseModuleOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
};

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_DB_URL, mongodbOptions),
    SocketModule,
    AuthModule,
    UsersModule,
    ChatsModule,
    MessagesModule,
  ],
  providers: [AppGateway],
  controllers: [],
})
export class AppModule {}
