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
    console.log(client.request._query.user);

    this.logger.log(`client disconnected -> ${client.id}`);
  }

  @SubscribeMessage('connectUser')
  async handleUserConnection(
    client: Socket,
    userData: AuthorizedUserInterface,
  ) {
    const chats = await this.chatsService.getChatsByAuthorId(userData.id);
    //Получаем чаты пользователя, и коннектим их в rooms
    chats.forEach((chat) => {
      client.join(chat.id);
    });

    this.socketService.client = client;
  }
}
