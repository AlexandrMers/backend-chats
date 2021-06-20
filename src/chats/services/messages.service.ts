import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { CommonService } from './common.service';

import { MessageDocument } from '../types';
import { ModelName } from '../../types';

import { formatMessageResponse } from '../helpers/formatMessageResponse';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(ModelName.MESSAGE)
    private readonly MessageModel: Model<MessageDocument>,
    private readonly commonService: CommonService,
  ) {}
  async getMessages(
    chatId: MessageDocument['_id'],
    currentUserId: MessageDocument['_id'],
  ) {
    if (!chatId) throw new Error('Не передан chatId');

    const validatedUserInChat = await this.commonService.validateUserInChat(
      chatId,
      currentUserId,
    );

    if (!validatedUserInChat)
      throw new Error('Пользователь не является участником чата');

    return await this.MessageModel.find({
      chat: chatId,
    })
      .populate('author attachments')
      .then((messagesData) =>
        messagesData.length > 0 ? messagesData.map(formatMessageResponse) : [],
      );
  }
}
