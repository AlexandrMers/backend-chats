import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';

import { ModelName } from '../../types';
import { UserDocument } from '../../users/types';

@Schema({
  timestamps: true,
})
export class Chat {
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: ModelName.USER,
  })
  author: UserDocument['_id'];

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: ModelName.USER,
  })
  partner: UserDocument['_id'];

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: ModelName.MESSAGE,
  })
  lastMessage: any;
}

export const ChatModel = SchemaFactory.createForClass(Chat);
