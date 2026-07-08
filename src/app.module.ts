import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { BullModule } from '@nestjs/bull';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './infra/auth/auth.module';
import { HttpModule } from './infra/http/http.module';
import { EnvModule } from './infra/env/env.module';
import { EmailModule } from './infra/email/email.module';
import { EventsModule } from './infra/events/events.module';
import { SchedulerModule } from './infra/scheduler/scheduler.module';
import { WhatsAppModule } from './infra/whatsapp/whatsapp.module';
import { ConfigModule } from '@nestjs/config';
import { envSchema } from './infra/env/env';
import { DomainErrorFilter } from './shared/filters/domain-error.filter';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    LoggerModule.forRoot({
      pinoHttp: {
        level: 'debug',
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            levelFirst: true,
            translateTime: 'yyyy-mm-dd HH:MM:ss Z',
          },
        },
      },
    }),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
        password: process.env.REDIS_PASSWORD || undefined,
        db: process.env.REDIS_DATABASE ? parseInt(process.env.REDIS_DATABASE, 10) : undefined,
      },
    }),
    AuthModule,
    HttpModule,
    EnvModule,
    EmailModule,
    EventsModule,
    SchedulerModule,
    WhatsAppModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: DomainErrorFilter,
    },
  ],
})
export class AppModule {}
