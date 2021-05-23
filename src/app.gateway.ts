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
import { ChatsService } from './chats/services/chats.service';
import { UsersService } from './users/services/users.service';

import {
  ChatEvent,
  SocketClientWithUserInfo,
  TypedSocket,
} from './socket/types';
import { AuthorizedUserInterface, UserResponseInterface } from './users/types';

@WebSocketGateway(8080)
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger: Logger = new Logger('AppGateway');

  constructor(
    private readonly socketService: SocketService,
    private readonly chatsService: ChatsService,
    private readonly usersService: UsersService,
  ) {}

  afterInit(server: Server): any {
    this.socketService.server = server;
  }

  handleConnection(client: Socket): void {
    this.logger.log(`client connected -> ${client.id}`);
  }

  async handleDisconnect(client: SocketClientWithUserInfo): Promise<void> {
    if (client?.id && client?.userInfo) {
      await this.usersService.setOnlineStatusInUser(client.userInfo.id, false);
    }

    const chatsBySocketId = this.socketService.activeSockets[client.id] || [];

    if (chatsBySocketId.length) {
      chatsBySocketId.forEach((chat) => {
        client.to(chat.id).emit(ChatEvent.USER_OFFLINE, client.userInfo);
        client.leave(chat.id);
      });
    }

    this.socketService.deleteSocket(client);
  }

  @SubscribeMessage(ChatEvent.CONNECT_USER)
  async handleUserConnection(
    client: TypedSocket<{ userInfo: UserResponseInterface }>,
    userData: AuthorizedUserInterface,
  ) {
    await this.usersService.setOnlineStatusInUser(userData.id, true);

    const chats = await this.chatsService.getChatsByAuthorId(userData.id);

    client.userInfo = userData;

    chats.forEach((chat) => {
      client.join(chat.id);
      client.to(chat.id).emit(ChatEvent.USER_ONLINE, userData);
    });

    this.socketService.addSocket(client);
    this.socketService.activeSockets[client.id] = chats;
  }
}
