import { Document } from 'mongoose';

import { User } from './models/user-model.schema';

export interface UserResponseInterface {
  id: UserDocument['_id'];
  confirmed: UserDocument['confirmed'];
  confirmHash: UserDocument['confirm_hash'];
  lastSeen: UserDocument['last_seen'];
  fullName: UserDocument['fullName'];
  email: UserDocument['email'];
  avatar: UserDocument['avatar'];
  isOnline: UserDocument['is_online'];
  password?: UserDocument['password'];
}

export type UserDocument = User & Document;

export type AuthorizedUserInterface = Omit<UserResponseInterface, 'password'>;
