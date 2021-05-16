import { Module } from '@nestjs/common';
import { ChatsService } from './services/chats.service';
import { ChatsController } from './controllers/chats.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ModelName } from '../types';
import { ChatModel } from './models/chat.schema';
import { UsersModule } from '../users/users.module';
import { CommonService } from './services/common.service';
import { MessageModel } from './models/messages.schema';
import { SocketModule } from '../socket/socket.module';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([{ name: ModelName.CHAT, schema: ChatModel }]),
    MongooseModule.forFeature([
      { name: ModelName.MESSAGE, schema: MessageModel },
    ]),
    SocketModule,
  ],
  providers: [ChatsService, CommonService],
  controllers: [ChatsController],
  exports: [ChatsService],
})
export class ChatsModule {}
