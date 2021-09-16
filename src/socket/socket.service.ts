import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';

import { ChatEvent, SocketClientWithUserInfo } from './types';
import {
  ChatResponseInterface,
  MessageResponseInterface,
} from '../chats/types';
import { UserResponseInterface } from '../users/types';

@Injectable()
export class SocketService {
  public server: Server = null;
  private sockets: SocketClientWithUserInfo[] = [];

  getAllSockets() {
    return this.sockets;
  }

  addSocket(socket: SocketClientWithUserInfo) {
    this.sockets = [...this.sockets, socket];
  }

  removeSocket(socketId: string) {
    this.sockets = this.sockets.filter((socket) => socket.id !== socketId);
  }

  getSocketByUserId(id: string) {
    const foundSocket = this.sockets.find(
      (socket) => socket.userInfo.id === id,
    );

    return foundSocket ?? null;
  }

  getSocketsByChatId(chatId: string) {
    const foundSocket = this.sockets.filter((socket) =>
      socket.chats.map((chat) => chat.id).includes(chatId),
    );

    return foundSocket ?? null;
  }

  createChatMessage(chatId: string, newMessage: MessageResponseInterface) {
    const socketsForSend = this.getSocketsByChatId(chatId);

    socketsForSend.forEach((socket) => {
      socket.emit(ChatEvent.NEW_MESSAGE, newMessage);
    });
  }

  createNewChat(
    authorId: string,
    partnerId: string,
    createdChat: ChatResponseInterface,
  ) {
    const foundSocketByPartnerId = this.getSocketByUserId(partnerId);
    const foundSocketByAuthorId = this.getSocketByUserId(authorId);

    if (foundSocketByAuthorId) {
      foundSocketByAuthorId?.chats.push(createdChat);
      foundSocketByAuthorId?.join(createdChat.id);
      foundSocketByAuthorId?.emit(ChatEvent.CREATED_CHAT, createdChat);
    }

    if (foundSocketByPartnerId) {
      foundSocketByPartnerId?.chats.push(createdChat);
      foundSocketByPartnerId?.join(createdChat.id);
      foundSocketByPartnerId?.emit(ChatEvent.CREATED_CHAT, createdChat);
    }
  }

  notifySockets = (callback: (socket: SocketClientWithUserInfo) => void) => {
    this.sockets.forEach(callback);
  };

  setUserIsOnline(
    userData: UserResponseInterface,
    chats: ChatResponseInterface[],
    isOnline: boolean,
  ) {
    this.notifySockets((socket) => {
      chats.forEach((chat) => {
        socket
          .to(chat.id)
          .emit(
            isOnline ? ChatEvent.USER_ONLINE : ChatEvent.USER_OFFLINE,
            userData,
          );
      });
    });
  }

  readMessagesUpdate(chatId: string, userId: string) {
    const socketByUserId = this.getSocketByUserId(userId);
    socketByUserId.to(chatId).emit(ChatEvent.READ_MESSAGE);
  }
}
