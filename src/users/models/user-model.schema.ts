import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import validator from 'validator';

@Schema({
  timestamps: true,
})
export class User {
  @Prop({
    type: String,
    required: true,
    validate: [validator.isEmail, 'invalid email'],
    unique: true,
  })
  email: string;

  @Prop({
    type: String,
    required: 'fullName is required',
  })
  fullName: string;

  @Prop({
    type: String,
    required: true,
    select: false,
  })
  password: string;

  @Prop({
    type: Boolean,
    default: false,
  })
  confirmed: boolean;

  @Prop({
    type: String,
    default: null,
  })
  avatar: string;

  @Prop({
    type: String,
  })
  confirm_hash: string;

  @Prop({
    type: Date,
    default: new Date(),
  })
  last_seen: Date;

  @Prop({
    type: Boolean,
    default: false,
  })
  is_online: boolean;
}

export const UserModel = SchemaFactory.createForClass(User);
