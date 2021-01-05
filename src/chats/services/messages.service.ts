import { Injectable } from '@nestjs/common';
import { MessageDocument } from '../types';
import { InjectModel } from '@nestjs/mongoose';
import { ModelName } from '../../types';
import { Model } from 'mongoose';
import { formatMessageResponse } from '../helpers/formatMessageResponse';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(ModelName.MESSAGE)
    private readonly MessageModel: Model<MessageDocument>,
  ) {}
  async getMessages(
    chatId: MessageDocument['_id'],
    currentUserId: MessageDocument['_id'],
  ) {
    return this.MessageModel.find()
      .where('chat', chatId)
      .populate('chat author')
      .find({
        $or: [
          { 'chat.author': currentUserId },
          { 'chat.partner': currentUserId },
        ],
      })
      .then((messages) =>
        messages.length ? messages.map(formatMessageResponse) : [],
      );
  }
}
