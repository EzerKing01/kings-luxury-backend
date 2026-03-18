import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user; // from JwtStrategy

    if (!user) {
      throw new ForbiddenException('You must be logged in');
    }

    if (user.role !== 'admin') {
      throw new ForbiddenException('You do not have admin privileges');
    }

    return true;
  }
}