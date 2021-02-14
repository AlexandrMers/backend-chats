import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptService {
  private bcrypt: typeof bcrypt;

  constructor() {
    this.bcrypt = bcrypt;
  }

  async hash(value: string, salt: number) {
    return this.bcrypt.hash(value, salt);
  }

  async compare(valueCrypt1: string, valueCrypt2: string) {
    return this.bcrypt.compareSync(valueCrypt1, valueCrypt2);
  }
}
