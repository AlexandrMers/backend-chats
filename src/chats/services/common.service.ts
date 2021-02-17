import { Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { SocketService } from '../../socket/socket.service';
import { ChatEvent } from '../../socket/types';

import { UserDocument } from '../../users/types';
import { ChatDocument, MessageDocument, MessageType } from '../types';
import { ModelName } from '../../types';

import { formatChatResponse } from '../helpers/formatChatResponse';
import { formatMessageResponse } from '../helpers/formatMessageResponse';

@Injectable()
export class CommonService {
  constructor(
    @InjectModel(ModelName.MESSAGE)
    private readonly MessageModel: Model<MessageDocument>,
    @InjectModel(ModelName.CHAT)
    private readonly ChatModel: Model<ChatDocument>,
    private readonly socketService: SocketService,
  ) {}

  async createMessage({
    type,
    authorId,
    chatId,
    text,
  }: {
    authorId: UserDocument['_id'];
    chatId: ChatDocument['_id'];
    text: MessageDocument['text'];
    type: MessageType;
  }) {
    const createdMessage = await new this.MessageModel({
      type,
      text,
      author: Types.ObjectId(authorId),
      chat: Types.ObjectId(chatId),
    })
      .save()
      .then((data) => data.populate('author').execPopulate());

    await this.updateLastMessageChat(chatId, createdMessage._id);

    const newMessage = createdMessage
      ? formatMessageResponse(createdMessage)
      : null;
    this.socketService.server
      .in(chatId)
      .emit(ChatEvent.NEW_MESSAGE, newMessage);
    return newMessage;
  }

  async updateLastMessageChat(
    chatId: ChatDocument['_id'],
    msgId: MessageDocument['_id'],
  ) {
    try {
      const updatedChat = await this.ChatModel.findByIdAndUpdate(
        chatId,
        { lastMessage: msgId },
        {
          new: true,
        },
      )
        .populate({
          path: 'lastMessage',
          populate: {
            path: 'author',
          },
        })
        .populate('author partner');

      return updatedChat ? formatChatResponse(updatedChat) : null;
    } catch (error) {
      throw Error(error);
    }
  }

  async validateUserInChat(
    chatId: ChatDocument['_id'],
    userId: UserDocument['_id'],
  ) {
    return this.ChatModel.findOne({
      _id: chatId,
      $or: [{ author: userId }, { partner: userId }],
    });
  }
}
