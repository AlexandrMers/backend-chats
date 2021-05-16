import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MailerModule } from '@nestjs-modules/mailer';

import { getMongoDbUrl, mongodbOptions } from './configs/mongodb';
import { configureMailerOptions } from './configs/mailer';

import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ChatsModule } from './chats/chats.module';
import { MessagesModule } from './chats/messages.module';
import { SocketModule } from './socket/socket.module';

import { AppGateway } from './app.gateway';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(getMongoDbUrl(process), mongodbOptions),
    MailerModule.forRoot(configureMailerOptions()),
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
