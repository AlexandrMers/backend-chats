import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';

import { UserModel } from '../users/models/user-model.schema';

import { UsersService } from '../users/services/users.service';
import { AuthService } from './auth.service';

import { AuthController } from './auth.controller';

import { ModelName } from '../types';
import { BcryptService } from './bcrypt.service';

@Module({
  imports: [
    JwtModule.register({
      secretOrPrivateKey: process.env.JWT_KEY,
    }),
    MongooseModule.forFeature([
      {
        name: ModelName.USER,
        schema: UserModel,
      },
    ]),
  ],
  providers: [UsersService, AuthService, BcryptService],
  controllers: [AuthController],
})
export class AuthModule {}
