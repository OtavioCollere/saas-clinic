import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { RateLimitGuard } from '../guards/rate-limit.guard';
import { AppRequest } from '@/core/types/fastify-request.type';

/**
 * Metadata key usada pelo RateLimitGuard
 */
export const RATE_LIMIT_KEY = 'rate_limit';

/**
 * Contexto do rate limit
 *
 * Serve para:
 * - isolar buckets no Redis
 * - diferenciar auth, gateway, etc.
 * - facilitar métricas e logs
 */
export enum RateLimitContext {
  AUTH = 'auth',
  GATEWAY = 'gateway',
}

/**
 * Opções do rate limit por rota
 */
export interface RateLimitOptions {
  /**
   * Contexto lógico do rate limit (auth, gateway, etc.)
   */
  context: RateLimitContext;

  /**
   * Nome lógico da rota
   * Ex: login, mfa_verify, forgot_password
   */
  key: string;

  /**
   * Quantidade máxima de tokens no bucket
   */
  capacity: number;

  /**
   * Quantos tokens são adicionados por intervalo
   */
  refillRate: number;

  /**
   * Intervalo (em segundos) para o refill
   */
  refillIntervalSeconds: number;

  /**
   * Função opcional para gerar a identidade do bucket
   *
   * Ex:
   *  - IP
   *  - IP + email
   *  - IP + userId
   */
  keyGenerator?: (request: AppRequest) => string;
}

/**
 * Decorator @RateLimit
 *
 * Exemplo de uso:
 *
 * @RateLimit({
 *   context: RateLimitContext.AUTH,
 *   key: 'login',
 *   capacity: 5,
 *   refillRate: 1,
 *   refillIntervalSeconds: 20,
 *   keyGenerator: (req) =>
 *     `${req.ip}|${req.body?.email?.toLowerCase()}`,
 * })
 */
export const RateLimit = (options: RateLimitOptions) =>
  applyDecorators(
    /**
     * Salva as opções como metadata da rota
     */
    SetMetadata(RATE_LIMIT_KEY, options),

    /**
     * Aplica o guard SOMENTE nesta rota
     */
    UseGuards(RateLimitGuard),
  );
