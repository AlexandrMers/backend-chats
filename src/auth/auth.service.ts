import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from '../users/services/users.service';

import { CreateUserDto } from '../users/controllers/create-user.dto';
import { BcryptService } from './bcrypt.service';
import { LoginUserDto } from '../users/controllers/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
    private readonly bcryptService: BcryptService,
  ) {}
  async login(loginData: LoginUserDto) {
    const candidate = await this.userService.getUserByEmail(
      loginData.email,
      true,
    );

    if (candidate && candidate.password) {
      const passwordResult = await this.bcryptService.compare(
        loginData.password,
        candidate.password,
      );

      if (passwordResult) {
        const userInfo = UsersService.excludePasswordFromUser(candidate);

        return this.jwtService.sign(userInfo, {
          secret: process.env.JWT_KEY,
          expiresIn: process.env.EXPIRES_IN_JWT,
        });
      }

      throw Error('Email или пароль указаны неверно.');
    }
    throw Error('Пользователь с таким email не зарегистрирован в системе.');
  }

  async register(userData: CreateUserDto) {
    const { validateEqualPasswords } = UsersService;

    if (!validateEqualPasswords(userData)) {
      throw new Error('Пароли не совпадают!');
    }

    const encryptedPassword = await bcrypt.hash(userData.password, 10);

    return this.userService.create({
      password: encryptedPassword,
      email: userData.email,
      fullName: userData.fullName,
    });
  }
}
