import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';

import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ChatsModule } from './chats/chats.module';
import { MessagesModule } from './chats/messages.module';
import { SocketModule } from './socket/socket.module';
import { AppGateway } from './app.gateway';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailerOptions } from '@nestjs-modules/mailer/dist/interfaces/mailer-options.interface';

const mongodbOptions: MongooseModuleOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
};

const configMailerModule: MailerOptions = {
  transport: {
    host: 'smtp.yandex.ru',
    port: 465,
    auth: {
      user: 'ch4ts.test@yandex.ru',
      pass: '1233214%',
    },
  },
};

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_DB_URL, mongodbOptions),
    MailerModule.forRoot(configMailerModule),
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
