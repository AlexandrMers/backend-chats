import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { Response } from 'express';
import { UsersHelpersService } from '../services/users-helpers.service';
import { CreateUserDto } from './create-user.dto';
import { UserResponseInterface } from '../types';

enum Statuses {
  ERROR = 'error',
  SUCCESS = 'success',
}

type CommonResponseType<SuccessType> = Promise<
  SuccessResponseType<SuccessType> | ErrorResponseType
>;

type SuccessResponseType<T> = Response<{
  status: Statuses.SUCCESS;
  data: T;
}>;

type ErrorResponseType = Response<{
  status: Statuses.ERROR;
  message: string;
}>;

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly userHelpers: UsersHelpersService,
  ) {}

  @Post('signup')
  async signUp(
    @Res() res: Response,
    @Body() createUserDto: CreateUserDto,
  ): CommonResponseType<UserResponseInterface> {
    if (!this.userHelpers.validateUserPassword(createUserDto)) {
      return res.status(HttpStatus.FORBIDDEN).json({
        status: Statuses.ERROR,
        message: 'Пароли не совпадают',
      });
    }

    try {
      const createdUser = await this.usersService.create(createUserDto);

      return res.status(HttpStatus.CREATED).json({
        status: Statuses.SUCCESS,
        data: createdUser,
      });
    } catch (error) {
      return res.status(HttpStatus.FORBIDDEN).json({
        status: Statuses.ERROR,
        message: error.toString(),
      });
    }
  }

  @Get(':id')
  async getUserInfo(
    @Res() res: Response,
    @Param('id') id: string,
  ): CommonResponseType<UserResponseInterface> {
    try {
      const user = await this.usersService.getUserInfo(id);

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
