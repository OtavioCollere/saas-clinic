import { Module } from '@nestjs/common';
import Redis from 'ioredis';
import { RateLimitService } from './rate-limit.service';

@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: () => {
        const host = process.env.REDIS_HOST || 'localhost';
        const port = process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : 6379;
        const password = process.env.REDIS_PASSWORD || '';
        const database = process.env.REDIS_DATABASE ? parseInt(process.env.REDIS_DATABASE, 10) : undefined;

        return new Redis({
          host,
          port,
          password: password || undefined,
          db: database,
        });
      },
    },
    {
      provide: RateLimitService,
      useFactory: (redis: Redis) => {
        return new RateLimitService(redis);
      },
      inject: ['REDIS_CLIENT'],
    },
  ],
  exports: [RateLimitService],
})
export class RateLimitModule {}

