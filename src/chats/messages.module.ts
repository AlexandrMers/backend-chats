import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from '../users/users.module';

import { MessageModel } from './models/messages.schema';
import { ChatModel } from './models/chat.schema';

import { MessagesService } from './services/messages.service';
import { CommonService } from './services/common.service';

import { MessagesController } from './controllers/messages.controller';

import { ModelName } from '../types';
import { SocketModule } from '../socket/socket.module';
import { FileUploadModel } from '../upload-files/models/file-upload.schema';

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
  providers: [CommonService, MessagesService],
  controllers: [MessagesController],
  exports: [MessagesService],
})
export class MessagesModule {}
