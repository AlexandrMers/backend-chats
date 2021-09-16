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

import { ChatEvent, SocketClientWithUserInfo } from './socket/types';
import { AuthorizedUserInterface } from './users/types';
import { MessagesService } from './chats/services/messages.service';

@WebSocketGateway(8080)
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger: Logger = new Logger('AppGateway');

  constructor(
    private readonly socketService: SocketService,
    private readonly chatsService: ChatsService,
    private readonly messagesService: MessagesService,
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

      this.socketService.setUserIsOnline(client.userInfo, client.chats, false);
    }

    this.socketService.removeSocket(client.id);
  }

  @SubscribeMessage(ChatEvent.CONNECT_USER)
  async handleUserConnection(
    client: SocketClientWithUserInfo,
    userData: AuthorizedUserInterface,
  ) {
    await this.usersService.setOnlineStatusInUser(userData.id, true);
    const chats = await this.chatsService.getChatsByParticipant(userData.id);

    client.userInfo = userData;
    client.chats = chats;

    chats.forEach((chat) => {
      client.join(chat.id);
    });

    this.socketService.addSocket(client);
    this.socketService.setUserIsOnline(userData, chats, true);
  }

  @SubscribeMessage(ChatEvent.READ_MESSAGE)
  async readMessage(
    client: SocketClientWithUserInfo,
    data: { chatId: string; userId: string },
  ) {
    try {
      const updatedMessages = await this.messagesService.updateManyMessages(
        data.chatId,
        data.userId,
      );
      // this.socketService.readMessagesUpdate(data.chatId, data.userId);
    } catch (e) {
      throw Error(e);
    }
  }
}
