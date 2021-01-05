import { Injectable } from '@nestjs/common';
import { UserDocument, UserResponseInterface } from '../../users/types';
import { InjectModel } from '@nestjs/mongoose';
import { ModelName } from '../../types';
import { Model } from 'mongoose';
import { ChatDocument, ChatResponseInterface, MessageType } from '../types';
import { formatChatResponse } from '../helpers/formatChatResponse';
import { CommonService } from './common.service';

@Injectable()
export class ChatsService {
  constructor(
    @InjectModel(ModelName.CHAT)
    private readonly ChatModel: Model<ChatDocument>,
    private commonService: CommonService,
  ) {}

  validateChat = async (
    authorId: UserDocument['_id'],
    partnerId: UserDocument['_id'],
  ) => {
    return this.ChatModel.findOne({
      $or: [
        {
          author: authorId,
          partner: partnerId,
        },
        {
          author: partnerId,
          partner: authorId,
        },
      ],
    });
  };

  create = async (
    author: UserResponseInterface,
    partnerId: UserDocument['_id'],
  ) => {
    const existedChatWithAuthorCurrentUser = await this.validateChat(
      author.id,
      partnerId,
    );

    if (existedChatWithAuthorCurrentUser) {
      throw Error('Чат уже создан');
    }

    try {
      const createdChat = await new this.ChatModel({
        author: author.id,
        partner: partnerId,
      }).save();

      // создание нового сообщения - метод из сервиса сообщений
      await this.commonService.createMessage({
        chatId: createdChat._id,
        type: MessageType.SYSTEM,
        text: `Пользователь ${author.fullName} создал чат`,
        authorId: author.id,
      });

      // Возвращаю чат с обновленным сообщением
      return await this.ChatModel.findOne({
        _id: createdChat._id,
      })
        .populate('author partner')
        .then((chat) => (chat ? formatChatResponse(chat) : null));
    } catch (error) {
      throw error;
    }
  };

  getChatsByAuthorId = async (
    authorId: UserDocument['_id'],
  ): Promise<ChatResponseInterface[]> => {
    try {
      return this.ChatModel.find({
        $or: [{ author: authorId }, { partner: authorId }],
      })
        .populate({
          path: 'lastMessage',
          populate: {
            path: 'author',
          },
        })
        .populate('author partner')
        .then((chatsData) =>
          chatsData.length ? chatsData.map(formatChatResponse) : [],
        );
    } catch (error) {
      throw Error(error);
    }
  };
}
