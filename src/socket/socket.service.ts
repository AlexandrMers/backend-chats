import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';
import { ChatResponseInterface } from '../chats/types';
import { ChatEvent, SocketClientWithUserInfo } from './types';

@Injectable()
export class SocketService {
  public server: Server = null;
  private clients: Set<SocketClientWithUserInfo> = new Set();
  public activeSockets: { [id: string]: ChatResponseInterface[] } = {};

  public addSocket(socket: SocketClientWithUserInfo) {
    this.clients.add(socket);
  }

  public getSocketClientByUserId(userId: string) {
    const socketClients = Array.from(this.clients.values());

    const foundClientById: SocketClientWithUserInfo | null = socketClients.find(
      (socket) => socket.userInfo.id === userId,
    );

    return foundClientById;
  }

  public deleteSocket(socket: SocketClientWithUserInfo) {
    const activeSocketDrop = this.activeSockets[socket.id];
    if (activeSocketDrop) {
      delete this.activeSockets[socket.id];
    }
    this.clients.delete(socket);
  }

  public createNewChat(chat: ChatResponseInterface, partnerId: string) {
    const client = this.getSocketClientByUserId(partnerId);

    if (!client) return;

    client.join(partnerId);
    client.to(partnerId).emit(ChatEvent.CREATED_CHAT, chat);

    const chatsByClientId = this.activeSockets[client.id];

    if (chatsByClientId) {
      chatsByClientId.push(chat);
    }
  }
}
