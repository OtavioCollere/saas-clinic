// import { CacheService } from "@/shared/services/cache/cache.service";
// import Redis from "ioredis";
// import { RedisCache } from "./redis/redis-cache";
import { Module } from "@nestjs/common";

@Module({
  // providers: [
  //   {
  //     provide: CacheService,
  //     useFactory: () => {

  //       const host = process.env.REDIS_HOST || 'localhost';
  //       const port = process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : 6379;
  //       const password = process.env.REDIS_PASSWORD || '';
  //       const database = process.env.REDIS_DATABASE ? parseInt(process.env.REDIS_DATABASE, 10) : undefined;

  //       const redis = new Redis({
  //         host,
  //         port,
  //         password: password || undefined,
  //         db: database
  //       });

  //       return redis
  //     },
  //     inject: [Redis],
  //   },
  // ],
  // exports: [CacheService],
  providers: [],
  exports: [],
})
export class CacheModule {}
