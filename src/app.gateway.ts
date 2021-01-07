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

@WebSocketGateway()
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger: Logger = new Logger('AppGateway');

  constructor(private readonly socketService: SocketService) {}

  afterInit(server: Server): any {
    this.logger.log('socket initialized');
    this.socketService.server = server;
  }

  handleConnection(client: Socket, ...args: any[]): void {
    this.logger.log(`client connected -> ${client.id}`);
  }

  handleDisconnect(client: Socket): void {
    this.logger.log(`client disconnected -> ${client.id}`);
  }

  @SubscribeMessage('messageToServer')
  handleMessage(client: Socket, text: string): void {
    console.log('msg from server -> ', text);
  }
}
