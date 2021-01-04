import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptService {
  private bcrypt: typeof bcrypt;

  constructor() {
    this.bcrypt = bcrypt;
  }

  async hash(password: string, salt: number) {
    return this.bcrypt.hash(password, salt);
  }

  async compare(passwordFromReq: string, passwordFromDb: string) {
    return this.bcrypt.compareSync(passwordFromReq, passwordFromDb);
  }
}
