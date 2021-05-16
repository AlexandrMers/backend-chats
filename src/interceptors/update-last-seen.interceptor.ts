import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';

import { UserResponseInterface } from '../users/types';
import { UsersService } from '../users/services/users.service';

@Injectable()
export class UpdateLastSeenInterceptor implements NestInterceptor {
  constructor(private readonly userService: UsersService) {}

  async intercept(context: ExecutionContext, next: CallHandler) {
    const httpContext = context.switchToHttp();
    const userInfo: UserResponseInterface = httpContext.getRequest().user;

    if (userInfo) {
      await this.userService.updateUserLastSeenDate(userInfo.id);
    }

    return next.handle();
  }
}
