import { Document } from 'mongoose';
import { Chat } from './models/chat.schema';
import { Message } from './models/messages.schema';
import { UserDocument } from '../users/types';
import { FileInterface, FileUploadDocument } from '../upload-files/types';

export type ChatDocument = Chat & Document;

export enum MessageType {
  SYSTEM,
  USER,
}

export type MessageDocument = Message & Document;

export interface ShortUserInterface {
  fullName: UserDocument['fullName'];
  id: UserDocument['_id'];
  avatar: UserDocument['avatar'];
}

export interface ChatResponseInterface {
  id: ChatDocument['_id'];
  author: ShortUserInterface;
  partner: ShortUserInterface;
  lastMessage: MessageResponseInterface;
}

export interface MessageResponseInterface {
  id: MessageDocument['_id'];
  chatId: MessageDocument['chat'];
  type: MessageType;
  isRead: MessageDocument['isRead'];
  text: MessageDocument['text'];
  createdAt: MessageDocument['createdAt'];
  author: ShortUserInterface;
  attachments: FileInterface[];
}

export interface ParamsForFindMessagesInterface {
  chatId: MessageDocument['_id'];
  currentUserId: string;
  limit: string;
  page: string;
}
