import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthUser } from '../types/auth-user.type';

export const GetUser = createParamDecorator(
  <K extends keyof AuthUser>(
    data: K | undefined,
    ctx: ExecutionContext,
  ): AuthUser[K] | AuthUser => {
    const request = ctx.switchToHttp().getRequest();
    const user: AuthUser = request.user;

    return data ? user[data] : user;
  },
);
