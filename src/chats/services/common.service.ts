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
import { FileUploadDocument } from '../../upload-files/types';

@Injectable()
export class CommonService {
  constructor(
    @InjectModel(ModelName.FILE_UPLOAD)
    private readonly FileUploadModel: Model<FileUploadDocument>,
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
    attachments = [],
  }: {
    authorId: UserDocument['_id'];
    chatId: ChatDocument['_id'];
    text: MessageDocument['text'];
    type: MessageType;
    attachments?: FileUploadDocument['_id'][];
  }) {
    const createdMessage = await new this.MessageModel({
      type,
      text,
      author: Types.ObjectId(authorId),
      chat: Types.ObjectId(chatId),
      attachments,
    })
      .save()
      .then((data) => data.populate('attachments author').execPopulate());

    await this.updateLastMessageChat(chatId, createdMessage._id);

    const newMessage = createdMessage
      ? formatMessageResponse(createdMessage)
      : null;
    this.socketService.server
      .in(chatId)
      .emit(ChatEvent.NEW_MESSAGE, newMessage);

    await this.FileUploadModel.updateMany(
      {
        _id: {
          $in: attachments,
        },
      },
      {
        $set: {
          message: Types.ObjectId(newMessage.id),
          chat: Types.ObjectId(chatId),
        },
      },
    );

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

  async updateManyMessagesByChatId(
    chatId: ChatDocument['id'],
    userId: UserDocument['_id'],
  ) {
    return new Promise((resolve, reject) => {
      this.MessageModel.updateMany(
        {
          chat: chatId,
          user: userId,
        },
        {
          $set: { isRead: true },
        },
        {
          multi: true,
        },
        (error, res) => {
          if (error) {
            return reject(error);
          }

          resolve(res);
        },
      );
    });
  }
}
