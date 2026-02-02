import Redis from "ioredis";
import { TOKEN_BUCKET_LUA } from "./token-bucket";
import type { RateLimitOptions } from "@/shared/decorators/rate-limit.decorator";

export class RateLimitService{
  constructor(
    private readonly redis: Redis,
  ) {}

  async consume(
    ip: string,
    options: RateLimitOptions,
  ): Promise<boolean> {
    const key = `rate_limit:${ip}`;
    const now = Math.floor(Date.now() / 1000);
  
    const result = await this.redis.eval(
      TOKEN_BUCKET_LUA,
      1,
      key,
      options.capacity,
      options.refillRate,
      now,
    );
  
    return result === 1;
  }
  
}