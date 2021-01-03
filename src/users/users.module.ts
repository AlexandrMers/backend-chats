import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserModel } from './models/user-model.schema';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';
import { ModelName } from '../types';
import { UsersHelpersService } from './services/users-helpers.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ModelName.USER, schema: UserModel }]),
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersHelpersService],
})
export class UsersModule {}
