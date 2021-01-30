import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

import { SocketService } from './socket/socket.service';
import { UsersService } from './users/services/users.service';

@WebSocketGateway(8080)
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger: Logger = new Logger('AppGateway');

  constructor(
    private readonly socketService: SocketService,
    private readonly usersService: UsersService,
  ) {}

  afterInit(server: Server): any {
    this.logger.log('socket initialized');
    this.socketService.server = server;
  }

  handleConnection(client: Socket): void {
    client.join('5ff5d26a4ec31a7dfbd4cf38');
    this.logger.log(`client connected -> ${client.id}`);
  }

  handleDisconnect(client: Socket): void {
    this.logger.log(`client disconnected -> ${client.id}`);
  }
}
