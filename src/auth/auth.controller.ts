import { Body, Controller, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { Response } from 'express';

import { UsersService } from '../users/services/users.service';
import { AuthService } from './services/auth.service';

import { UserResponseInterface } from '../users/types';
import {
  AuthorizedRequestInterface,
  CommonResponseType,
  Statuses,
} from '../types';

import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginUserDto } from '../users/dto/login-user.dto';
import { HashUserDTO } from './hash.dto';

@Controller()
export class AuthController {
  constructor(
    private readonly userService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post('login')
  async login(
    @Req() req: AuthorizedRequestInterface,
    @Res() res: Response,
    @Body() loginData: LoginUserDto,
  ) {
    try {
      const token = await this.authService.login(loginData);

      return res.status(HttpStatus.OK).json({
        status: Statuses.SUCCESS,
        data: {
          token: token,
        },
      });
    } catch (error) {
      return res.status(HttpStatus.FORBIDDEN).json({
        status: Statuses.ERROR,
        message: error.toString(),
      });
    }
  }

  @Post('register')
  async register(
    @Res() res: Response,
    @Body() createUserDto: CreateUserDto,
  ): CommonResponseType<UserResponseInterface> {
    try {
      const createdUser = await this.authService.register(createUserDto);

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

  @Post('confirm-registration')
  async confirmRegistration(
    @Res() res: Response,
    @Body() hashUserDTO: HashUserDTO,
  ): CommonResponseType<string> {
    try {
      const message = await this.authService.confirmHash(hashUserDTO.hash);

      return res.status(HttpStatus.CREATED).json({
        status: Statuses.SUCCESS,
        data: message,
      });
    } catch (error) {
      return res.status(HttpStatus.FORBIDDEN).json({
        status: Statuses.ERROR,
        message: error.toString(),
      });
    }
  }
}
