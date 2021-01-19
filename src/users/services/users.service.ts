import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ModelName } from '../../types';
import { CreateUserDto } from '../dto/create-user.dto';
import {
  AuthorizedUserInterface,
  UserDocument,
  UserResponseInterface,
} from '../types';
import { assoc, compose, identity, ifElse, omit } from 'ramda';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(ModelName.USER)
    private readonly UserModel: Model<UserDocument>,
  ) {}

  static excludePasswordFromUser(
    user: UserResponseInterface,
  ): AuthorizedUserInterface {
    return omit(['password'])(user);
  }

  static formatUser(
    userDoc: UserDocument,
    visiblePassword?: boolean,
  ): UserResponseInterface {
    const userDocJson = userDoc.toJSON();

    return compose(
      ifElse(
        () => visiblePassword,
        assoc('password', userDocJson.password),
        identity,
      ),
      () => ({
        id: userDocJson?._id,
        confirmed: userDocJson?.confirmed,
        lastSeen: userDocJson?.last_seen,
        fullName: userDocJson?.fullName,
        email: userDocJson?.email,
      }),
    )();
  }

  static validateEqualPasswords = ({
    password,
    confirmedPassword,
  }: CreateUserDto) => password === confirmedPassword;

  create = async (
    userData: Omit<CreateUserDto, 'confirmedPassword'>,
  ): Promise<UserResponseInterface | Error | null> => {
    const user = new this.UserModel({
      email: userData.email,
      fullName: userData.fullName,
      password: userData.password,
    });

    return user
      .save()
      .then((userData: UserDocument) =>
        userData ? UsersService.formatUser(userData) : null,
      );
  };

  async getUserById(id: string): Promise<UserResponseInterface | null> {
    return this.UserModel.findById(id).then((userData) =>
      userData ? UsersService.formatUser(userData) : null,
    );
  }

  async getUsers(): Promise<UserResponseInterface[] | []> {
    return this.UserModel.find().then((userData) =>
      userData.length
        ? userData.map((user) => UsersService.formatUser(user))
        : [],
    );
  }

  async getUserByEmail(
    email: string,
    isVisiblePassword?: boolean,
  ): Promise<UserResponseInterface | null> {
    return this.UserModel.findOne({
      email,
    })
      .select(isVisiblePassword ? '+password' : '')
      .then((userData) =>
        userData ? UsersService.formatUser(userData, isVisiblePassword) : null,
      );
  }

  async updateUserLastSeenDate(id: string): Promise<UserDocument> {
    return this.UserModel.findOneAndUpdate(
      { _id: id },
      {
        last_seen: new Date(),
      },
      { new: true },
      () => {},
    );
  }
}
