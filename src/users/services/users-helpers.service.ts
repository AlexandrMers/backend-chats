import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../controllers/create-user.dto';

@Injectable()
export class UsersHelpersService {
  validateUserPassword = ({ password, confirmedPassword }: CreateUserDto) =>
    password === confirmedPassword;
}
