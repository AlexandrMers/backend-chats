import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { tap } from 'rxjs/operators';
import { Response } from 'express';

import { UserResponseInterface } from '../users/types';
import { UsersService } from '../users/services/users.service';

@Injectable()
export class UpdateLastSeenInterceptor implements NestInterceptor {
  constructor(private readonly userService: UsersService) {}

  private updateLastSeenUser() {
    return tap((data: { req: { user: UserResponseInterface } & Response }) => {
      const userData = data.req.user.id;

      if (!userData) {
        return;
      }
      this.userService.updateUserLastSeenDate(userData);
    });
  }

  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(this.updateLastSeenUser());
  }
}
