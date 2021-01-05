import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';

import { UserModel } from '../users/models/user-model.schema';

import { UsersService } from '../users/services/users.service';
import { AuthService } from './services/auth.service';

import { AuthController } from './auth.controller';

import { BcryptService } from './services/bcrypt.service';

import { ModelName } from '../types';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_KEY,
      signOptions: { expiresIn: process.env.EXPIRES_IN_JWT },
    }),
    MongooseModule.forFeature([
      {
        name: ModelName.USER,
        schema: UserModel,
      },
    ]),
  ],
  providers: [UsersService, AuthService, BcryptService, JwtStrategy],
  controllers: [AuthController],
  exports: [],
})
export class AuthModule {}
