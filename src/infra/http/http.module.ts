import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { EmailModule } from '../email/email.module';
import { HealthController } from './controlers/health/health.controller';
import { CryptographyModule } from '../cryptography/cryptography.module';
import { SetupMfaController } from './controlers/mfa/setup-mfa.controller';
import { AuthenticateUserController } from './controlers/users/authenticate-user.controller';
import { EnableMfaController } from './controlers/mfa/enable-mfa.controller';
import { MfaVerifyLoginController } from './controlers/mfa/mfa-verify-login.controller';
import { AuthenticateUserUseCase } from '@/domain/application/use-cases/users/authenticate-user';
import { SetupMfaUseCase } from '@/domain/application/use-cases/mfa/setup-mfa';
import { EnableMfaUseCase } from '@/domain/application/use-cases/mfa/enable-mfa';
import { MfaVerifyLoginUseCase } from '@/domain/application/use-cases/mfa/mfa-verify-login';
import { RegisterUserUseCase } from '@/domain/application/use-cases/users/register-user';
import { RegisterUserController } from './controlers/users/register-user.controller';
import { SendEmailVerificationController } from './controlers/email-verification/send-email-verification';
import { SendEmailVerificationUseCase } from '@/domain/application/use-cases/email-verification/send-email-verification';

@Module({
  imports: [DatabaseModule, CryptographyModule, EmailModule],
  controllers: [
    HealthController,
    AuthenticateUserController,
    SetupMfaController,
    EnableMfaController,
    MfaVerifyLoginController,
    RegisterUserController,

    SendEmailVerificationController
  ],
  providers: [
    AuthenticateUserUseCase,
    SetupMfaUseCase,
    EnableMfaUseCase,
    MfaVerifyLoginUseCase,
    RegisterUserUseCase,

    SendEmailVerificationUseCase
  ],

})
export class HttpModule {}
