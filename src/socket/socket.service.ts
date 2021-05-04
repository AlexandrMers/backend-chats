import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';
import { ChatResponseInterface } from '../chats/types';
import { SocketClientWithUserInfo } from './types';

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
}
