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
import { UsersService } from './users/services/users.service';

type TypedSocket<T> = Socket & T;

@WebSocketGateway(8080)
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger: Logger = new Logger('AppGateway');
  private activeSockets: any = {};

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

  async handleDisconnect(
    client: TypedSocket<{ userInfo: UserResponseInterface }>,
  ): Promise<void> {
    // TODO - меняем статус пользователя на isOnline=false
    await this.usersService.setOnlineStatusInUser(client.userInfo.id, false);

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
    //TODO - устанавливаем статус подключившегося пользователя isOnline=true
    await this.usersService.setOnlineStatusInUser(userData.id, true);

    // TODO - при подключении определенного юзера, мы получаем все чаты, в которых он участвует, и отсылаем в них события, что этот пользователь появился в сети
    const chats = await this.chatsService.getChatsByAuthorId(userData.id);

    chats.forEach((chat) => {
      client.userInfo = userData;
      client.join(chat.id);

      client.to(chat.id).emit(ChatEvent.USER_ONLINE, userData);
    });

    this.activeSockets[client.id] = chats;
  }
}
