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
    if (!chatId) throw new Error('Не передан chatId');

    const messages = await this.MessageModel.find()
      .populate('chat author')
      .where('chat', chatId)
      .find({
        $or: [
          {
            'chat.author': currentUserId,
          },
          {
            'chat.partner': currentUserId,
          },
        ],
      });

    console.log('messages services -> ', messages);
    // .or([
    //   {
    //     path: 'chat.author',
    //     value: currentUserId,
    //   },
    //   {
    //     path: 'chat.partner',
    //     value: currentUserId,
    //   },
    // ]);
    // console.log('messages -> ', messages);
    return [];
  }
}
