import {
  Controller,
  Get,
  HttpStatus,
  Param,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response, Request } from 'express';

import { UsersService } from '../services/users.service';

import { UserResponseInterface } from '../types';
import { CommonResponseType } from '../../types';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('user/:id')
  async getUserInfo(
    @Req() req: Request,
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
