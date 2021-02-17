import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

import { SocketService } from './socket/socket.service';
import { AuthorizedUserInterface } from './users/types';
import { ChatsService } from './chats/services/chats.service';
import { ChatEvent } from './socket/types';

@WebSocketGateway(8080)
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger: Logger = new Logger('AppGateway');

  constructor(
    private readonly socketService: SocketService,
    private readonly chatsService: ChatsService,
  ) {}

  afterInit(server: Server): any {
    this.logger.log('socket initialized');
    this.socketService.server = server;
  }

  handleConnection(client: Socket): void {
    console.log('handle connect');

    this.logger.log(`client connected -> ${client.id}`);
  }

  handleDisconnect(client: Socket): void {
    // client.server.emit('user_leave', 'leave');
    //@ts-ignore
    console.log('client leave -> ', client.userInfo);
    //@ts-ignore
    console.log('client rooms -> ', client.chatsIds);
    this.logger.log(`client disconnected -> ${client.id}`);
  }

  @SubscribeMessage(ChatEvent.CONNECT_USER)
  async handleUserConnection(
    client: Socket,
    userData: AuthorizedUserInterface,
  ) {
    const chats = await this.chatsService.getChatsByAuthorId(userData.id);

    //@ts-ignore
    client.chatsIds = [];

    chats.forEach((chat) => {
      //@ts-ignore
      client.userInfo = userData;
      client.join(chat.id).emit('user_online', 'online');
      //@ts-ignore
      client.chatsIds.push(chat.id);
    });
  }
}
