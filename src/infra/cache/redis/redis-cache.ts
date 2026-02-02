import type { CacheService } from "@/shared/services/cache/cache.service";
import { Redis } from "ioredis";

export class RedisCache implements CacheService{
    constructor(
      private readonly redis: Redis,
    ){}

    async get(key: string): Promise<string | null> {
        return this.redis.get(key);
    }

    async set(key: string, value: string, ttl: number): Promise<void> {
        await this.redis.set(key, value, 'EX', ttl);
    }

    async delete(key: string): Promise<void> {
        await this.redis.del(key);
    }
}