import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsController } from './chats.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ModelName } from '../types';
import { ChatModel } from './models/chat.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ModelName.CHAT, schema: ChatModel }]),
  ],
  providers: [ChatsService],
  controllers: [ChatsController],
})
export class ChatsModule {}
