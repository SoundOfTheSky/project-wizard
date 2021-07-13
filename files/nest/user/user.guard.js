import { Injectable } from '@nestjs/common';
import { verify } from 'jsonwebtoken';
import { secret } from '../config';

@Injectable()
export class UserGuard {
  canActivate(context) {
    try {
      const request = context.switchToHttp().getRequest();
      request.authorization = verify(request.cookies.authorization, secret);
      return true;
    } catch {
      return false;
    }
  }
}
