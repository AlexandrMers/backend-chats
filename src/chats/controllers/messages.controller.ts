import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Put,
  Req,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { UpdateLastSeenInterceptor } from '../../common/update-last-seen.interceptor';
import { CreateMessageDto } from '../dto/create-message.dto';
import { UserResponseInterface } from '../../users/types';
import { Request, Response } from 'express';
import { Statuses } from '../../types';
import { MessagesService } from '../services/messages.service';
import { MessageType } from '../types';
import { CommonService } from '../services/common.service';

@UseInterceptors(UpdateLastSeenInterceptor)
@Controller('messages')
export class MessagesController {
  constructor(
    private readonly messagesService: MessagesService,
    private readonly commonService: CommonService,
  ) {}

  @Get()
  async getMessages(
    @Req() req: { user: UserResponseInterface } & Request,
    @Res() res: Response,
  ) {
    try {
      const messages = await this.messagesService.getMessages(
        req.query.chatId,
        req.user?.id,
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
