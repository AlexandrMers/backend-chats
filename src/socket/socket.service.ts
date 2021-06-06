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

    console.log('foundSocket -> ', foundSocket);

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

  createNewChat(partnerId: string, createdChat: ChatResponseInterface) {
    const foundSocket = this.getSocketByUserId(partnerId);
    if (!foundSocket) {
      return;
    }

    foundSocket.chats.push(createdChat);
    foundSocket.join(createdChat.id);
    foundSocket.emit(ChatEvent.CREATED_CHAT, createdChat);
  }

  setUserIsOnline(
    userData: UserResponseInterface,
    chats: ChatResponseInterface[],
    isOnline: boolean,
  ) {
    this.sockets.forEach((socket) => {
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
}
