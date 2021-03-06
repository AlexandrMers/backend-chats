import { Injectable } from '@nestjs/common';
import { Model, Schema, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

// Services
import { CommonService } from './common.service';

// Types
import { MessageDocument, ParamsForFindMessagesInterface } from '../types';
import { ModelName } from '../../types';

// Helpers
import { formatMessageResponse } from '../helpers/formatMessageResponse';
import { calculatePagination } from '../helpers/calculatePagination';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(ModelName.MESSAGE)
    private readonly MessageModel: Model<MessageDocument>,
    private readonly commonService: CommonService,
  ) {}

  async validateIsExistUserInChat(chatId: string, userId) {
    if (!chatId) throw new Error('Не передан chatId');

    const validatedUserInChat = await this.commonService.validateUserInChat(
      chatId,
      userId,
    );

    if (!validatedUserInChat) {
      throw new Error('Пользователь не является участником чата');
    }
  }

  async getMessages({
    chatId,
    currentUserId,
    limit,
    page,
  }: ParamsForFindMessagesInterface) {
    await this.validateIsExistUserInChat(chatId, currentUserId);

    const { startIndex, parsedLimit } = calculatePagination(page, limit);

    return await this.MessageModel.find({
      chat: chatId,
    })
      .sort({
        createdAt: -1,
      })
      .limit(parsedLimit)
      .skip(startIndex)
      .populate('author attachments')
      .then((messagesData) =>
        messagesData.length > 0 ? messagesData.map(formatMessageResponse) : [],
      );
  }

  async updateManyMessages(chatId: string, userId: string) {
    await this.validateIsExistUserInChat(chatId, userId);
    return this.commonService.updateManyMessagesByChatId(chatId, userId);
  }
}
