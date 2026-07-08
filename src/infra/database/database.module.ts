import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { UsersRepository } from '@/domain/application/repositories/users-repository';
import { MfaSettingsRepository } from '@/domain/application/repositories/mfa-settings-repository';
import { SessionsRepository } from '@/domain/application/repositories/sessions-repository';
import { EmailVerificationRepository } from '@/domain/application/repositories/email-verification-repository';
import { ClinicRepository } from '@/domain/application/repositories/clinic-repository';
import { ClinicMembershipRepository } from '@/domain/application/repositories/clinic-membership-repository';
import { FranchiseRepository } from '@/domain/application/repositories/franchise-repository';
import { ProfessionalRepository } from '@/domain/application/repositories/professional-repository';
import { PatientRepository } from '@/domain/application/repositories/patient-repository';
import { AnamnesisRepository } from '@/domain/application/repositories/anamnesis-repository';
import { ProcedureRepository } from '@/domain/application/repositories/procedure-repository';
import { AppointmentsRepository } from '@/domain/application/repositories/appointments-repository';
import { ServiceOrderRepository } from '@/domain/application/repositories/service-order-repository';
import { PasswordVerificationRepository } from '@/domain/application/repositories/password-verification-repository';
import { WhatsAppConversationRepository } from '@/domain/application/repositories/whatsapp-conversation-repository';
import { NotificationLogRepository } from '@/domain/application/repositories/notification-log-repository';
import { AnamnesisTokenRepository } from '@/domain/application/repositories/anamnesis-token-repository';
import { PrismaUsersRepository } from './prisma/repositories/prisma-users-repository';
import { PrismaMfaSettingsRepository } from './prisma/repositories/prisma-mfa-settings-repository';
import { PrismaSessionsRepository } from './prisma/repositories/prisma-sessions-repository';
import { PrismaEmailVerificationRepository } from './prisma/repositories/prisma-email-verification-repository';
import { PrismaPasswordVerificationRepository } from './prisma/repositories/prisma-password-verification-repository';
import { PrismaClinicRepository } from './prisma/repositories/prisma-clinic-repository';
import { PrismaClinicMembershipRepository } from './prisma/repositories/prisma-clinic-membership-repository';
import { PrismaFranchiseRepository } from './prisma/repositories/prisma-franchise-repository';
import { PrismaProfessionalRepository } from './prisma/repositories/prisma-professional-repository';
import { PrismaPatientRepository } from './prisma/repositories/prisma-patient-repository';
import { PrismaAnamnesisRepository } from './prisma/repositories/prisma-anamnesis-repository';
import { PrismaProcedureRepository } from './prisma/repositories/prisma-procedure-repository';
import { PrismaAppointmentsRepository } from './prisma/repositories/prisma-appointments-repository';
import { PrismaServiceOrderRepository } from './prisma/repositories/prisma-service-order-repository';
import { PrismaWhatsAppConversationRepository } from './prisma/repositories/prisma-whatsapp-conversation-repository';
import { PrismaNotificationLogRepository } from './prisma/repositories/prisma-notification-log-repository';
import { PrismaAnamnesisTokenRepository } from './prisma/repositories/prisma-anamnesis-token-repository';
import { TransactionManager } from '@/domain/application/transactions/transaction-manager';
import { PrismaTransactionManager } from './prisma-transaction-manager';

@Module({
  providers: [
    PrismaService,
    { provide: TransactionManager, useClass: PrismaTransactionManager },
    {provide : UsersRepository, useClass : PrismaUsersRepository},
    {provide : MfaSettingsRepository, useClass : PrismaMfaSettingsRepository},
    {provide : SessionsRepository, useClass : PrismaSessionsRepository},
    {provide : EmailVerificationRepository, useClass : PrismaEmailVerificationRepository},
    {provide : ClinicRepository, useClass : PrismaClinicRepository},
    {provide : ClinicMembershipRepository, useClass : PrismaClinicMembershipRepository},
    {provide : FranchiseRepository, useClass : PrismaFranchiseRepository},
    {provide : ProfessionalRepository, useClass : PrismaProfessionalRepository},
    {provide : PatientRepository, useClass : PrismaPatientRepository},
    {provide : AnamnesisRepository, useClass : PrismaAnamnesisRepository},
    {provide : ProcedureRepository, useClass : PrismaProcedureRepository},
    {provide : AppointmentsRepository, useClass : PrismaAppointmentsRepository},
    {provide : ServiceOrderRepository, useClass : PrismaServiceOrderRepository},
    {provide : PasswordVerificationRepository, useClass : PrismaPasswordVerificationRepository},
    {provide : WhatsAppConversationRepository, useClass : PrismaWhatsAppConversationRepository},
    {provide : NotificationLogRepository, useClass : PrismaNotificationLogRepository},
    {provide : AnamnesisTokenRepository, useClass : PrismaAnamnesisTokenRepository},
  ],
  exports: [
    PrismaService,
    TransactionManager,
    UsersRepository,
    MfaSettingsRepository,
    SessionsRepository,
    EmailVerificationRepository,
    PasswordVerificationRepository,
    ClinicRepository,
    ClinicMembershipRepository,
    FranchiseRepository,
    ProfessionalRepository,
    PatientRepository,
    AnamnesisRepository,
    ProcedureRepository,
    AppointmentsRepository,
    ServiceOrderRepository,
    WhatsAppConversationRepository,
    NotificationLogRepository,
    AnamnesisTokenRepository,
  ],
})
export class DatabaseModule {}
