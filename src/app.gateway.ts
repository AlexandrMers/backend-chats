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

import { ChatEvent } from './socket/types';
import { AuthorizedUserInterface, UserResponseInterface } from './users/types';

type TypedSocket<T> = Socket & T;

@WebSocketGateway(8080)
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger: Logger = new Logger('AppGateway');
  private activeSockets: any = {};

  constructor(
    private readonly socketService: SocketService,
    private readonly chatsService: ChatsService,
  ) {}

  afterInit(server: Server): any {
    this.socketService.server = server;
  }

  handleConnection(client: Socket): void {
    this.logger.log(`client connected -> ${client.id}`);
  }

  handleDisconnect(
    client: TypedSocket<{ userInfo: UserResponseInterface }>,
  ): void {
    const chatsBySocketId = this.activeSockets[client.id] || [];
    if (chatsBySocketId.length) {
      chatsBySocketId.forEach((chat) => {
        client.to(chat.id).emit(ChatEvent.USER_OFFLINE, client.userInfo);
      });
    }

    //TODO - при рассоединении сокета, необходимо удалить из памяти объект с сокетами
    delete this.activeSockets[client.id];
  }

  @SubscribeMessage(ChatEvent.CONNECT_USER)
  async handleUserConnection(
    client: TypedSocket<{ userInfo: UserResponseInterface }>,
    userData: AuthorizedUserInterface,
  ) {
    const chats = await this.chatsService.getChatsByAuthorId(userData.id);

    // TODO - при подключении определенного юзера, мы получаем все чаты, в которых он участвует, и отсылаем в них события, что этот пользователь появился в сети
    chats.forEach((chat) => {
      client.userInfo = userData;
      client.join(chat.id);

      client.to(chat.id).emit(ChatEvent.USER_ONLINE, userData);
    });

    this.activeSockets[client.id] = chats;
  }
}
