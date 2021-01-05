import { Injectable } from '@nestjs/common';
import { UserDocument } from '../users/types';
import { InjectModel } from '@nestjs/mongoose';
import { ModelName } from '../types';
import { Model } from 'mongoose';
import { ChatDocument } from './types';

export interface ShortUserInterface {
  fullName: UserDocument['fullName'];
  id: UserDocument['_id'];
}

interface ChatResponseInterface {
  id: ChatDocument['_id'];
  author: ShortUserInterface;
  partner: ShortUserInterface;
  lastMessage: any;
}

export const formatChatResponse = (
  chat: ChatDocument,
): ChatResponseInterface => {
  const chatJson = chat?.toJSON();

  return {
    id: chatJson?._id,
    author: {
      fullName: chatJson?.author.fullName,
      id: chatJson?.author._id,
    },
    partner: {
      fullName: chatJson?.partner.fullName,
      id: chatJson?.partner._id,
    },
    lastMessage: null,
  };
};

@Injectable()
export class ChatsService {
  constructor(
    @InjectModel(ModelName.CHAT)
    private readonly ChatModel: Model<ChatDocument>,
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
    authorId: UserDocument['_id'],
    partnerId: UserDocument['_id'],
  ) => {
    const existedChatWithAuthorCurrentUser = await this.validateChat(
      authorId,
      partnerId,
    );

    if (existedChatWithAuthorCurrentUser) {
      throw Error('Чат уже создан');
    }

    try {
      return new this.ChatModel({
        author: authorId,
        partner: partnerId,
      }).save();

      // const createdSystemMessage = await this._messageService.createMessage({
      //   chatId: createdChat._id,
      //   type: TypeMessageEnum.SYSTEM,
      //   text: `Пользователь ${author.fullName} создал чат`,
      //   authorId: author._id,
      // });
      //
      // return this.updateLastMessage(
      //   createdChat._id, createdSystemMessage.id,
      // );
    } catch (error) {
      throw Error(error);
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
