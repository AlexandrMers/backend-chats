import { Socket } from 'socket.io';
import { UserResponseInterface } from '../users/types';
import { ChatResponseInterface } from '../chats/types';

export enum ChatEvent {
  NEW_MESSAGE = 'NEW_MESSAGE',
  CREATED_CHAT = 'CREATED_CHAT',
  CONNECT_USER = 'CONNECT_USER',
  USER_ONLINE = 'USER_ONLINE',
  USER_OFFLINE = 'USER_OFFLINE',
  READ_MESSAGE = 'READ_MESSAGE',
}

export type TypedSocket<T> = Socket & T;

export type SocketClientWithUserInfo = TypedSocket<{
  userInfo: UserResponseInterface;
  chats: ChatResponseInterface[];
}>;
