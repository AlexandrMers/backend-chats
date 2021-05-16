import {
  Controller,
  Get,
  HttpStatus,
  Param,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';

import { UsersService } from '../services/users.service';

import { UserResponseInterface } from '../types';
import { CommonResponseType } from '../../types';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { UpdateLastSeenInterceptor } from '../../interceptors/update-last-seen.interceptor';
import { SocketService } from '../../socket/socket.service';

@UseInterceptors(UpdateLastSeenInterceptor)
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly socketService: SocketService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(
    @Req()
    req: {
      user: UserResponseInterface;
    } & Response,
    @Res()
    res: Response,
  ) {
    try {
      const user = await this.usersService.getUserById(req.user.id);

      if (!user) {
        return res.status(HttpStatus.NOT_FOUND).json({
          status: 'error',
          message: 'Пользователь не найден',
        });
      }

      return res.status(HttpStatus.OK).json({
        status: 'success',
        data: user,
      });
    } catch (error) {
      return res.status(HttpStatus.FORBIDDEN).json({
        status: 'error',
        message: error.toString(),
      });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  async getUserInfo(
    @Res() res: Response,
    @Param('id') id: string,
  ): CommonResponseType<UserResponseInterface> {
    try {
      const user = await this.usersService.getUserById(id);

      if (!user) {
        return res.status(HttpStatus.NOT_FOUND).json({
          status: 'error',
          message: 'Пользователь не найден',
        });
      }

      return res.status(HttpStatus.OK).json({
        status: 'success',
        data: user,
      });
    } catch (error) {
      return res.status(HttpStatus.FORBIDDEN).json({
        status: 'error',
        message: error.toString(),
      });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/')
  async getUsers(
    @Res() res: Response,
  ): CommonResponseType<UserResponseInterface[]> {
    try {
      const users = await this.usersService.getUsers();

      return res.status(HttpStatus.OK).json({
        status: 'success',
        data: users,
      });
    } catch (error) {
      return res.status(HttpStatus.FORBIDDEN).json({
        status: 'error',
        message: error.toString(),
      });
    }
  }
}
