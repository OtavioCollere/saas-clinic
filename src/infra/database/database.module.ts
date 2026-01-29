import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { UsersRepository } from '@/domain/application/repositories/users-repository';
import { MfaSettingsRepository } from '@/domain/application/repositories/mfa-settings-repository';
import { SessionsRepository } from '@/domain/application/repositories/sessions-repository';
import { EmailVerificationRepository } from '@/domain/application/repositories/email-verification-repository';
import { PrismaUsersRepository } from './prisma/repositories/prisma-users-repository';
import { PrismaMfaSettingsRepository } from './prisma/repositories/prisma-mfa-settings-repository';
import { PrismaSessionsRepository } from './prisma/repositories/prisma-sessions-repository';
import { PrismaEmailVerificationRepository } from './prisma/repositories/prisma-email-verification-repository';

@Module({
  providers: [
    PrismaService,
    {provide : UsersRepository, useClass : PrismaUsersRepository},
    {provide : MfaSettingsRepository, useClass : PrismaMfaSettingsRepository},
    {provide : SessionsRepository, useClass : PrismaSessionsRepository},
    {provide : EmailVerificationRepository, useClass : PrismaEmailVerificationRepository},
  ],
  exports: [
    PrismaService,
    UsersRepository,
    MfaSettingsRepository,
    SessionsRepository,
    EmailVerificationRepository,
  ],
})
export class DatabaseModule {}
