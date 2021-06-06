import { Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { CommonService } from './common.service';

import { formatChatResponse } from '../helpers/formatChatResponse';

import { UserDocument, UserResponseInterface } from '../../users/types';
import { ChatDocument, ChatResponseInterface, MessageType } from '../types';
import { ModelName } from '../../types';

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
        author: Types.ObjectId(author.id),
        partner: Types.ObjectId(partnerId),
      }).save();

      await this.commonService.createMessage({
        chatId: createdChat._id,
        type: MessageType.SYSTEM,
        text: `Пользователь ${author.fullName} создал чат`,
        authorId: author.id,
      });

      const updatedChat = await this.ChatModel.findOne({
        _id: createdChat._id,
      })
        .populate('author partner lastMessage')
        .populate({
          path: 'lastMessage',
          populate: 'author',
        });
      return updatedChat ? formatChatResponse(updatedChat) : null;
    } catch (error) {
      throw error;
    }
  };

  getChatsByParticipant = async (
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
