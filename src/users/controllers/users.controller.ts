import { Controller, Get, HttpStatus, Param, Res } from '@nestjs/common';
import { Response } from 'express';

import { UsersService } from '../services/users.service';

import { UserResponseInterface } from '../types';
import { CommonResponseType } from '../../types';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('user/:id')
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
}
