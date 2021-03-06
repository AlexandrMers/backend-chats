import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';

import { UsersService } from '../../users/services/users.service';
import { BcryptService } from './bcrypt.service';

import { CreateUserDto } from '../../users/dto/create-user.dto';
import { LoginUserDto } from '../../users/dto/login-user.dto';

import { configureSendMailOptions, getTemplateRegistration } from './helpers';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
    private readonly bcryptService: BcryptService,
    private readonly mailerService: MailerService,
  ) {}

  private static generateHash(): string {
    const generatedPart1 = Date.now().toString();
    const generatedPart2 = Math.random().toString();
    return `${generatedPart1}_${generatedPart2}`;
  }

  async login(userData: LoginUserDto) {
    const candidate = await this.validateUser(userData);

    return this.jwtService.sign(candidate, {
      secret: process.env.JWT_KEY,
      expiresIn: process.env.EXPIRES_IN_JWT,
    });
  }

  async validateUser(userData: LoginUserDto) {
    const candidate = await this.userService.getUserByEmail(
      userData.email,
      true,
    );

    if (candidate && candidate.password) {
      const passwordResult = await this.bcryptService.compare(
        userData.password,
        candidate.password,
      );

      if (passwordResult) {
        return UsersService.excludePasswordFromUser(candidate);
      }
      throw new Error('Email или пароль указаны неверно.');
    }
    throw new Error('Пользователь с таким email не зарегистрирован в системе.');
  }

  async register(userData: CreateUserDto) {
    const { validateEqualPasswords } = UsersService;

    if (!validateEqualPasswords(userData)) {
      throw new Error('Пароли не совпадают!');
    }

    const encryptedPassword = await bcrypt.hash(userData.password, 10);
    const generatedHash = AuthService.generateHash();

    const user = await this.userService.create({
      password: encryptedPassword,
      email: userData.email,
      fullName: userData.fullName,
      confirmHash: generatedHash,
    });

    if (user) {
      this.mailerService.sendMail(
        configureSendMailOptions({
          to: userData.email,
          subject: 'Подтверждение регистрации',
          text: 'Подтвердите регистрацию',
          html: getTemplateRegistration(generatedHash),
        }),
      );
    }

    return user;
  }

  async confirmHash(hash: string) {
    const userByHash = await this.userService.getUserByHash(hash);

    if (!userByHash) {
      throw new Error('Не найден пользователь по сгенерированному хешу');
    }

    const hashResult = userByHash.confirmHash === hash;

    if (!hashResult) {
      throw new Error(
        'Сгенерированный хеш пользователя не соответствует сохраненному хешу в базе данных',
      );
    }

    await this.userService.updateConfirmedUserStatus(hash);

    return 'Аккаунт успешно подтвержден';
  }
}
