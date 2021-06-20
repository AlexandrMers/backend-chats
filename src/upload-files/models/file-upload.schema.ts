import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';

// Types
import { ModelName } from '../../types';
import { ChatDocument, MessageDocument } from '../../chats/types';
import { UserDocument } from '../../users/types';

@Schema({
  timestamps: true,
})
export class FileUpload {
  @Prop({
    type: SchemaTypes.String,
  })
  publicId: string;

  @Prop({
    type: SchemaTypes.String,
  })
  fileName: string;

  @Prop({
    type: SchemaTypes.Number,
  })
  size: number;

  @Prop({
    type: SchemaTypes.String,
  })
  extension: string;

  @Prop({
    type: SchemaTypes.String,
  })
  url: string;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: ModelName.MESSAGE,
  })
  message: MessageDocument['_id'];

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: ModelName.CHAT,
  })
  chat: ChatDocument['_id'];

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: ModelName.USER,
  })
  user: UserDocument['_id'];
}

export const FileUploadModel = SchemaFactory.createForClass(FileUpload);
