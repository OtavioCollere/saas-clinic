import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { UsersRepository } from '@/domain/application/repositories/users-repository';
import { MfaSettingsRepository } from '@/domain/application/repositories/mfa-settings-repository';
import { SessionsRepository } from '@/domain/application/repositories/sessions-repository';
import { EmailVerificationRepository } from '@/domain/application/repositories/email-verification-repository';
import { ClinicRepository } from '@/domain/application/repositories/clinic-repository';
import { PatientRepository } from '@/domain/application/repositories/patient-repository';
import { AnamnesisRepository } from '@/domain/application/repositories/anamnesis-repository';
import { PrismaUsersRepository } from './prisma/repositories/prisma-users-repository';
import { PrismaMfaSettingsRepository } from './prisma/repositories/prisma-mfa-settings-repository';
import { PrismaSessionsRepository } from './prisma/repositories/prisma-sessions-repository';
import { PrismaEmailVerificationRepository } from './prisma/repositories/prisma-email-verification-repository';
import { PrismaClinicRepository } from './prisma/repositories/prisma-clinic-repository';
import { PrismaPatientRepository } from './prisma/repositories/prisma-patient-repository';
import { PrismaAnamnesisRepository } from './prisma/repositories/prisma-anamnesis-repository';

@Module({
  providers: [
    PrismaService,
    {provide : UsersRepository, useClass : PrismaUsersRepository},
    {provide : MfaSettingsRepository, useClass : PrismaMfaSettingsRepository},
    {provide : SessionsRepository, useClass : PrismaSessionsRepository},
    {provide : EmailVerificationRepository, useClass : PrismaEmailVerificationRepository},
    {provide : ClinicRepository, useClass : PrismaClinicRepository},
    {provide : PatientRepository, useClass : PrismaPatientRepository},
    {provide : AnamnesisRepository, useClass : PrismaAnamnesisRepository},
  ],
  exports: [
    PrismaService,
    UsersRepository,
    MfaSettingsRepository,
    SessionsRepository,
    EmailVerificationRepository,
    ClinicRepository,
    PatientRepository,
    AnamnesisRepository,
  ],
})
export class DatabaseModule {}
