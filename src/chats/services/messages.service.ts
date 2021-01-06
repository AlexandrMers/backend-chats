import { Injectable } from '@nestjs/common';
import { MessageDocument } from '../types';
import { InjectModel } from '@nestjs/mongoose';
import { ModelName } from '../../types';
import { Model } from 'mongoose';
import { CommonService } from './common.service';
import { clearConfigCache } from 'prettier';
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
      .populate(['author'])
      .then((messagesData) =>
        messagesData.length > 0 ? messagesData.map(formatMessageResponse) : [],
      );
  }
}
