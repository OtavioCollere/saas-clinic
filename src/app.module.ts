import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { BullModule } from '@nestjs/bull';
import { AuthModule } from './infra/auth/auth.module';
import { HttpModule } from './infra/http/http.module';
import { EnvModule } from './infra/env/env.module';
import { EmailModule } from './infra/email/email.module';
import { ConfigModule } from '@nestjs/config';
import { envSchema } from './infra/env/env';
import { DomainErrorFilter } from './shared/filters/domain-error.filter';
import { AppLoggerModule } from './infra/observability/logger.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
      },
    }),
    AppLoggerModule,
    AuthModule,
    HttpModule,
    EnvModule,
    EmailModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: DomainErrorFilter,
    },
  ],
})
export class AppModule {}
