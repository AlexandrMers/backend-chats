import { Body, Controller, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { Response, Request } from 'express';

import { UsersService } from '../users/services/users.service';
import { AuthService } from './services/auth.service';

import { AuthorizedUserInterface, UserResponseInterface } from '../users/types';
import { CommonResponseType, Statuses } from '../types';

import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginUserDto } from '../users/dto/login-user.dto';

interface AuthorizedRequestInterface extends Request {
  user: AuthorizedUserInterface;
}

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
}
