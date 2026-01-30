import {
    CanActivate,
    ExecutionContext,
    HttpException,
    HttpStatus,
    Injectable,
  } from '@nestjs/common';
  import { Reflector } from '@nestjs/core';
  import { Redis } from 'ioredis';
import { RATE_LIMIT_KEY, RateLimitOptions } from '../decorators/rate-limit.decorator';
import { AppRequest } from '../types/fastify-request.type';
  

  /**
   * RateLimitGuard
   *
   * Implementa rate limiting no padrão Token Bucket usando Redis.
   * O comportamento é controlado via decorator @RateLimit().
   *
   * - Cada rota define sua policy (capacity, refill, etc.)
   * - Chaves são isoladas por contexto (auth, gateway, etc.)
   * - Redis garante atomicidade
   */
  @Injectable()
  export class RateLimitGuard implements CanActivate {
    constructor(
      private readonly reflector: Reflector,
      private readonly redis: Redis, // Redis injetado pelo module
    ) {}
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
      /**
       * 1️⃣ Recupera metadata do decorator @RateLimit
       */
      const options = this.reflector.get<RateLimitOptions>(
        RATE_LIMIT_KEY,
        context.getHandler(),
      );
  
      /**
       * Se a rota não tem @RateLimit, o guard não faz nada
       */
      if (!options) {
        return true;
      }
  
      /**
       * 2️⃣ Extrai request
       */
      const request = context.switchToHttp().getRequest<AppRequest>();
  
      /**
       * 3️⃣ Gera a chave base do rate limit
       *
       * Se a rota forneceu um keyGenerator customizado, usa ele.
       * Caso contrário, cai no default (IP).
       */
      const identityKey =
        options.keyGenerator?.(request) ?? this.defaultKeyGenerator(request);
  
      /**
       * 4️⃣ Monta a chave final no Redis
       *
       * Exemplo:
       * rate_limit:auth:login:127.0.0.1|email@test.com
       */
      const redisKey = [
        'rate_limit',
        options.context,
        options.key,
        identityKey,
      ].join(':');
  
      /**
       * 5️⃣ Executa o algoritmo de Token Bucket no Redis
       */
      const now = Math.floor(Date.now() / 1000);
  
      const allowed = await this.consumeToken(
        redisKey,
        options,
        now,
      );
  
      /**
       * 6️⃣ Se não tiver token disponível, bloqueia
       */
      if (!allowed) {
        throw new HttpException(
          {
          error: 'rate_limited',
          context: options.context,
          key: options.key,
          message: 'Too many requests. Please try again later.',
          },
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }
  
      /**
       * 7️⃣ Libera a requisição
       */
      return true;
    }
  
    /**
     * Default key generator
     *
     * ⚠️ NÃO é ideal para auth sensível.
     * Use apenas se a rota não fornecer um keyGenerator.
     */
    private defaultKeyGenerator(request: AppRequest): string {
      return request.ip;
    }
  
    /**
     * Consome um token do bucket no Redis
     *
     * Implementação simples e segura:
     * - Cada key guarda:
     *   - tokens restantes
     *   - timestamp do último refill
     */
    private async consumeToken(
      key: string,
      options: RateLimitOptions,
      now: number,
    ): Promise<boolean> {
      const {
        capacity,
        refillRate,
        refillIntervalSeconds,
      } = options;
  
      /**
       * Usamos Lua script pra garantir atomicidade
       */
      const luaScript = `
        local tokens_key = KEYS[1]
        local capacity = tonumber(ARGV[1])
        local refill_rate = tonumber(ARGV[2])
        local refill_interval = tonumber(ARGV[3])
        local now = tonumber(ARGV[4])
  
        local data = redis.call("HMGET", tokens_key, "tokens", "last_refill")
        local tokens = tonumber(data[1])
        local last_refill = tonumber(data[2])
  
        if tokens == nil then
          tokens = capacity
          last_refill = now
        end
  
        local elapsed = now - last_refill
        if elapsed > 0 then
          local refill = math.floor(elapsed / refill_interval) * refill_rate
          if refill > 0 then
            tokens = math.min(capacity, tokens + refill)
            last_refill = now
          end
        end
  
        if tokens <= 0 then
          redis.call("HMSET", tokens_key, "tokens", tokens, "last_refill", last_refill)
          redis.call("EXPIRE", tokens_key, refill_interval * capacity)
          return 0
        end
  
        tokens = tokens - 1
        redis.call("HMSET", tokens_key, "tokens", tokens, "last_refill", last_refill)
        redis.call("EXPIRE", tokens_key, refill_interval * capacity)
        return 1
      `;
  
      const result = await this.redis.eval(
        luaScript,
        1,
        key,
        capacity,
        refillRate,
        refillIntervalSeconds,
        now,
      );
  
      return result === 1;
    }
  }
  