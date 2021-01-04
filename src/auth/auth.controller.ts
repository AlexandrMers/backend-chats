import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { CreateUserDto } from '../users/controllers/create-user.dto';
import { UserResponseInterface } from '../users/types';
import { CommonResponseType, Statuses } from '../types';
import { UsersService } from '../users/services/users.service';
import { AuthService } from './auth.service';
import { LoginUserDto } from '../users/controllers/login-user.dto';

@Controller()
export class AuthController {
  constructor(
    private readonly userService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post('signin')
  async signIn(@Res() res: Response, @Body() loginUserDto: LoginUserDto) {
    try {
      const loginData = await this.authService.login(loginUserDto);

      return res.status(HttpStatus.OK).json({
        status: Statuses.SUCCESS,
        data: {
          token: loginData,
        },
      });
    } catch (error) {
      return res.status(HttpStatus.FORBIDDEN).json({
        status: Statuses.ERROR,
        data: error.toString(),
      });
    }
  }

  @Post('signup')
  async signUp(
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
