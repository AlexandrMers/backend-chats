import { User } from './models/user-model.schema';
import { Document } from 'mongoose';

export interface UserResponseInterface {
  id: UserDocument['_id'];
  confirmed: UserDocument['confirmed'];
  lastSeen: UserDocument['last_seen'];
  fullName: UserDocument['fullName'];
  email: UserDocument['email'];
  password?: UserDocument['password'];
}

export type UserDocument = User & Document;
