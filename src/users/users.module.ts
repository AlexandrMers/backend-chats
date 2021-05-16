import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserModel } from './models/user-model.schema';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';
import { ModelName } from '../types';
import { SocketModule } from '../socket/socket.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ModelName.USER, schema: UserModel }]),
    SocketModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
