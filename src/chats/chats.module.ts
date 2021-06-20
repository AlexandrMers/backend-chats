import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

// services
import { ChatsService } from './services/chats.service';
import { CommonService } from './services/common.service';

// controllers
import { ChatsController } from './controllers/chats.controller';

// models
import { ChatModel } from './models/chat.schema';
import { MessageModel } from './models/messages.schema';
import { FileUploadModel } from '../upload-files/models/file-upload.schema';

// modules
import { SocketModule } from '../socket/socket.module';
import { UsersModule } from '../users/users.module';

// types
import { ModelName } from '../types';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([
      { name: ModelName.FILE_UPLOAD, schema: FileUploadModel },
    ]),
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
