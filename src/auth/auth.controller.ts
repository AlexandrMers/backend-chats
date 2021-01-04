import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { CreateUserDto } from '../users/controllers/create-user.dto';
import { UserResponseInterface } from '../users/types';
import { CommonResponseType, Statuses } from '../types';
import { UsersService } from '../users/services/users.service';

@Controller()
export class AuthController {
  constructor(private readonly userService: UsersService) {}

  @Post('signup')
  async signUp(
    @Res() res: Response,
    @Body() createUserDto: CreateUserDto,
  ): CommonResponseType<UserResponseInterface> {
    try {
      const createdUser = await this.userService.create(createUserDto);

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
