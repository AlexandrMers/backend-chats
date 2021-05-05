import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Put,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { UpdateLastSeenInterceptor } from '../../interceptors/update-last-seen.interceptor';

import { ChatsService } from '../services/chats.service';
import { SocketService } from '../../socket/socket.service';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

import { UserDocument, UserResponseInterface } from '../../users/types';
import { Statuses } from '../../types';
import { ChatEvent } from '../../socket/types';

@UseInterceptors(UpdateLastSeenInterceptor)
@Controller('chats')
export class ChatsController {
  constructor(
    private readonly chatService: ChatsService,
    private readonly socketService: SocketService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Put('/create')
  async createChat(
    @Req() req: { user: UserResponseInterface } & Request,
    @Res() res: Response,
    @Body('partnerId') partnerId: UserDocument['_id'],
  ) {
    try {
      const createdChat = await this.chatService.create(req.user, partnerId);

      this.socketService.createNewChat(createdChat, partnerId);

      return res.status(HttpStatus.CREATED).json({
        status: 'ok',
        data: createdChat,
      });
    } catch (error) {
      return res.status(HttpStatus.FORBIDDEN).json({
        status: 'error',
        message: error.toString(),
      });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getChats(
    @Req() req: { user: UserResponseInterface } & Request,
    @Res() res: Response,
  ) {
    try {
      const chats = await this.chatService.getChatsByAuthorId(req.user.id);

      res.status(HttpStatus.OK).json({
        status: Statuses.SUCCESS,
        data: chats ?? [],
      });
    } catch (error) {
      res.status(HttpStatus.FORBIDDEN).json({
        status: Statuses.ERROR,
        message: error.toString(),
      });
    }
  }
}
