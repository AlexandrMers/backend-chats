import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';

import { ModelName } from '../../types';
import { UserDocument } from '../../users/types';

import { ChatDocument, MessageType } from '../types';

@Schema({
  timestamps: true,
})
export class Message {
  @Prop({
    type: Number,
    default: MessageType.USER,
    required: true,
  })
  type: MessageType;

  @Prop({
    type: String,
    required: true,
  })
  text: string;

  @Prop({
    type: Boolean,
    default: false,
  })
  isRead: string;

  @Prop({
    type: SchemaTypes.ObjectId,
    required: true,
    ref: ModelName.USER,
  })
  author: UserDocument['_id'];

  @Prop({
    type: SchemaTypes.ObjectId,
    required: true,
    ref: ModelName.CHAT,
  })
  chat: ChatDocument['_id'];

  @Prop({
    type: SchemaTypes.Date,
  })
  createdAt: Date;
}

export const MessageModel = SchemaFactory.createForClass(Message);
