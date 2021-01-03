import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ModelName } from '../../types';
import { CreateUserDto } from '../controllers/create-user.dto';
import { UserDocument, UserResponseInterface } from '../types';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(ModelName.USER)
    private readonly UserModel: Model<UserDocument>,
  ) {}

  static formatUser(userDoc: UserDocument): UserResponseInterface {
    const userDocJson = userDoc.toJSON();
    return {
      id: userDocJson?._id,
      confirmed: userDocJson?.confirmed,
      lastSeen: userDocJson?.last_seen,
      fullName: userDocJson?.fullName,
      email: userDocJson?.email,
    };
  }

  create = async (
    userData: CreateUserDto,
  ): Promise<UserResponseInterface | null> => {
    const encryptedPassword = await bcrypt.hash(userData.password, 10);

    const user = new this.UserModel({
      email: userData.email,
      fullName: userData.fullName,
      password: encryptedPassword,
    });

    return user
      .save()
      .then((userData: UserDocument) =>
        userData ? UsersService.formatUser(userData) : null,
      );
  };

  async getUserInfo(id: string): Promise<UserResponseInterface | null> {
    return this.UserModel.findById(id).then((userData) =>
      userData ? UsersService.formatUser(userData) : null,
    );
  }
}
