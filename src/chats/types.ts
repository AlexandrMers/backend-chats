import { Document } from 'mongoose';
import { Chat } from './models/chat.schema';

export type ChatDocument = Chat & Document;
