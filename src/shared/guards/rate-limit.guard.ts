import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { RateLimitService } from '@/infra/rate-limit/rate-limit.service';
import {
  RATE_LIMIT_KEY,
  RateLimitOptions,
} from '../decorators/rate-limit.decorator';

@Injectable()
export class RateLimitGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly rateLimit: RateLimitService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const handler = context.getHandler();
    const controller = context.getClass();

    const options =
      this.reflector.get<RateLimitOptions>(RATE_LIMIT_KEY, handler) ??
      this.reflector.get<RateLimitOptions>(RATE_LIMIT_KEY, controller);

    // Se a rota não tiver @RateLimit, deixa passar
    if (!options) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const ip = request.ip;

    const allowed = await this.rateLimit.consume(
      ip,
      options,
    );

    if (!allowed) {
      throw new HttpException('Rate limit exceeded', HttpStatus.TOO_MANY_REQUESTS);
    }

    return true;
  }
}
