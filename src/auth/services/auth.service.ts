import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from '../../users/services/users.service';

import { CreateUserDto } from '../../users/dto/create-user.dto';
import { BcryptService } from './bcrypt.service';
import { LoginUserDto } from '../../users/dto/login-user.dto';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
    private readonly bcryptService: BcryptService,
    private readonly mailerService: MailerService,
  ) {}

  private static generateHash(email: string): string {
    const generatedPartHash = Date.now().toString();
    return `${email}_${generatedPartHash}`;
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
    const generatedHash = AuthService.generateHash(userData.email);
    const encryptedHash = await bcrypt.hash(generatedHash, 16);

    const user = await this.userService.create({
      password: encryptedPassword,
      email: userData.email,
      fullName: userData.fullName,
      confirmHash: encryptedHash,
    });

    await this.mailerService
      .sendMail({
        to: userData.email,
        from: process.env.MAIL_USER,
        subject: 'Подтверждение регистрации',
        text: 'Подтвердите регистрацию',
        html: `
        <h1>Подтверждение регистрации</h1>
        <p>Чтобы подтвердить регистрацию, пожалуйста, перейдите по <a href='${
          process.env.BASE_FRONT_URI + encryptedHash
        }'>ссылке</a>.</p>
        <p>Если вы ничего не отправляли, пожалуйста, проигнорируйте это письмо.</p>
      `,
      })
      .then((data) => {
        console.log('letter sent -> ', data);
      })
      .catch((err) => {
        console.log('err => ', err);
      });

    return user;
  }
}
