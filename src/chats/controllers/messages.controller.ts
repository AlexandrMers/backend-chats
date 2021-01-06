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

import { UpdateLastSeenInterceptor } from '../../common/update-last-seen.interceptor';

import { MessagesService } from '../services/messages.service';
import { CommonService } from '../services/common.service';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

import { UserResponseInterface } from '../../users/types';
import { Statuses } from '../../types';
import { MessageType } from '../types';

import { CreateMessageDto } from '../dto/create-message.dto';

@UseInterceptors(UpdateLastSeenInterceptor)
@Controller('messages')
export class MessagesController {
  constructor(
    private readonly messagesService: MessagesService,
    private readonly commonService: CommonService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getMessages(
    @Req() req: { user: UserResponseInterface } & Request,
    @Res() res: Response,
  ) {
    try {
      const messages = await this.messagesService.getMessages(
        req.query.chatId,
        req.user.id,
      );

      res.status(HttpStatus.OK).json({
        status: Statuses.SUCCESS,
        data: {
          chatId: req.query.chatId,
          messages,
        },
      });
    } catch (error) {
      res.status(HttpStatus.FORBIDDEN).json({
        status: Statuses.ERROR,
        message: error.toString(),
      });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put('/create')
  async createMessage(
    @Body() createMessageDto: CreateMessageDto,
    @Req() req: { user: UserResponseInterface } & Request,
    @Res() res: Response,
  ) {
    try {
      const newMessage = await this.commonService.createMessage({
        authorId: req.user.id,
        chatId: createMessageDto.chatId,
        text: createMessageDto.text,
        type: MessageType.USER,
      });

      return res.status(HttpStatus.CREATED).json({
        status: Statuses.SUCCESS,
        data: newMessage,
      });
    } catch (error) {
      return res.status(HttpStatus.FORBIDDEN).json({
        status: Statuses.ERROR,
        message: error.toString(),
      });
    }
  }
}
