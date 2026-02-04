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
  ) {
    // Verifica se as dependências foram injetadas corretamente
    if (!this.reflector) {
      console.error('RateLimitGuard: Reflector não foi injetado!');
    }
    if (!this.rateLimit) {
      console.error('RateLimitGuard: RateLimitService não foi injetado!');
    }
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      // Se o reflector ou rateLimit não estiverem disponíveis, permite a requisição
      if (!this.reflector || !this.rateLimit) {
        console.warn('RateLimitGuard: Dependências não disponíveis, permitindo requisição');
        return true;
      }

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
      const ip = request.ip || request.socket?.remoteAddress || 'unknown';

      const allowed = await this.rateLimit.consume(
        ip,
        options,
      );

      if (!allowed) {
        throw new HttpException('Rate limit exceeded', HttpStatus.TOO_MANY_REQUESTS);
      }

      return true;
    } catch (error) {
      // Se houver qualquer erro no rate limiting, permite a requisição para não quebrar o app
      console.error('RateLimitGuard error:', error);
      return true;
    }
  }
}
