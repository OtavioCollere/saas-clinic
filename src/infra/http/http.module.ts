import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { DatabaseModule } from '../database/database.module';
import { EmailModule } from '../email/email.module';
import { CryptographyModule } from '../cryptography/cryptography.module';
import { CacheModule } from '../cache/cache.module';
import { RateLimitModule } from '../rate-limit/rate-limit.module';
import { RateLimitGuard } from '@/shared/guards/rate-limit.guard';

// Controllers
import { HealthController } from './controlers/health/health.controller';
import { HealthCheckController } from './controlers/health/health-check.controller';
import { AuthenticateUserController } from './controlers/users/authenticate-user.controller';
import { RegisterUserController } from './controlers/users/register-user.controller';
import { LogoutController } from './controlers/users/logout.controller';
import { SetupMfaController } from './controlers/mfa/setup-mfa.controller';
import { EnableMfaController } from './controlers/mfa/enable-mfa.controller';
import { MfaVerifyLoginController } from './controlers/mfa/mfa-verify-login.controller';
import { SendEmailVerificationController } from './controlers/email-verification/send-email-verification';
import { CreateClinicController } from './controlers/clinic/create-clinic.controller';
import { EditClinicController } from './controlers/clinic/edit-clinic.controller';
import { ActivateClinicController } from './controlers/clinic/activate-clinic.controller';
import { InactivateClinicController } from './controlers/clinic/inactivate-clinic.controller';
import { GetClinicByIdController } from './controlers/clinic/get-clinic-by-id.controller';
import { FetchClinicController } from './controlers/clinic/fetch-clinic.controller';
import { RegisterFranchiseController } from './controlers/franchise/register-franchise.controller';
import { EditFranchiseController } from './controlers/franchise/edit-franchise.controller';
import { ActivateFranchiseController } from './controlers/franchise/activate-franchise.controller';
import { InactivateFranchiseController } from './controlers/franchise/inactivate-franchise.controller';
import { FetchFranchisesByClinicIdController } from './controlers/franchise/fetch-franchises-by-clinic-id.controller';
import { RegisterPatientController } from './controlers/patient/register-patient.controller';
import { EditPatientController } from './controlers/patient/edit-patient.controller';
import { GetPatientByIdController } from './controlers/patient/get-patient-by-id.controller';
import { FetchPatientsController } from './controlers/patient/fetch-patients.controller';
import { CreateProfessionalController } from './controlers/professional/create-professional.controller';
import { EditProfessionalController } from './controlers/professional/edit-professional.controller';
import { GetProfessionalController } from './controlers/professional/get-professional.controller';
import { GetProfessionalsByFranchiseIdController } from './controlers/professional/get-professionals-by-franchise-id.controller';
import { CreateProcedureController } from './controlers/procedure/create-procedure.controller';
import { EditProcedureController } from './controlers/procedure/edit-procedure.controller';
import { GetProcedureByIdController } from './controlers/procedure/get-procedure-by-id.controller';
import { FetchProceduresByFranchiseIdController } from './controlers/procedure/fetch-procedures-by-franchise-id.controller';
import { InactivateProcedureController } from './controlers/procedure/inactivate-procedure.controller';
import { CreateAnamnesisController } from './controlers/anamnesis/create-anamnesis.controller';
import { GetAnamnesisByPatientIdController } from './controlers/anamnesis/get-anamnesis-by-patient-id.controller';
import { CancelAppointmentController } from './controlers/appointment/cancel-appointment.controller';
import { ConfirmAppointmentController } from './controlers/appointment/confirm-appointment.controller';
import { FetchAppointmentsByPatientIdController } from './controlers/appointment/fetch-appointments-by-patient-id.controller';

// Use Cases
import { AuthenticateUserUseCase } from '@/domain/application/use-cases/users/authenticate-user';
import { RegisterUserUseCase } from '@/domain/application/use-cases/users/register-user';
import { LogoutUseCase } from '@/domain/application/use-cases/users/logout';
import { SetupMfaUseCase } from '@/domain/application/use-cases/mfa/setup-mfa';
import { EnableMfaUseCase } from '@/domain/application/use-cases/mfa/enable-mfa';
import { MfaVerifyLoginUseCase } from '@/domain/application/use-cases/mfa/mfa-verify-login';
import { SendEmailVerificationUseCase } from '@/domain/application/use-cases/email-verification/send-email-verification';
import { CreateClinicUseCase } from '@/domain/application/use-cases/clinic/create-clinic';
import { EditClinicUseCase } from '@/domain/application/use-cases/clinic/edit-clinic';
import { ActivateClinicUseCase } from '@/domain/application/use-cases/clinic/activate-clinic';
import { InactivateClinicUseCase } from '@/domain/application/use-cases/clinic/inactivate-clinic';
import { GetClinicByIdUseCase } from '@/domain/application/use-cases/clinic/get-clinic-by-id';
import { FetchClinicUseCase } from '@/domain/application/use-cases/clinic/fetch-clinic';
import { RegisterFranchiseUseCase } from '@/domain/application/use-cases/franchise/register-franchise';
import { EditFranchiseUseCase } from '@/domain/application/use-cases/franchise/edit-franchise';
import { ActivateFranchiseUseCase } from '@/domain/application/use-cases/franchise/activate-franchise';
import { InactivateFranchiseUseCase } from '@/domain/application/use-cases/franchise/inactivate-franchise';
import { FetchFranchisesByClinicIdUseCase } from '@/domain/application/use-cases/franchise/fetch-franchises-by-clinic-id';
import { RegisterPatientUseCase } from '@/domain/application/use-cases/patient/register-patient';
import { EditPatientUseCase } from '@/domain/application/use-cases/patient/edit-patient';
import { GetPatientByIdUseCase } from '@/domain/application/use-cases/patient/get-patient-by-id';
import { FetchPatientsUseCase } from '@/domain/application/use-cases/patient/fetch-patients';
import { CreateProfessionalUseCase } from '@/domain/application/use-cases/professional/create-professional';
import { EditProfessionalUseCase } from '@/domain/application/use-cases/professional/edit-professional';
import { GetProfessionalUseCase } from '@/domain/application/use-cases/professional/get-professional';
import { GetProfessionalsByFranchiseIdUseCase } from '@/domain/application/use-cases/professional/get-professionals-by-franchise-id';
import { CreateProcedureUseCase } from '@/domain/application/use-cases/procedure/create-procedure';
import { EditProcedureUseCase } from '@/domain/application/use-cases/procedure/edit-procedure';
import { GetProcedureByIdUseCase } from '@/domain/application/use-cases/procedure/get-procedure-by-id';
import { FetchProceduresByFranchiseIdUseCase } from '@/domain/application/use-cases/procedure/fetch-procedures-by-franchise-id';
import { InactivateProcedureUseCase } from '@/domain/application/use-cases/procedure/inactivate-procedure';
import { CreateAnamnesisUseCase } from '@/domain/application/use-cases/anamnesis/create-anamnesis';
import { GetAnamnesisByPatientIdUseCase } from '@/domain/application/use-cases/anamnesis/get-anamnesis-by-patient-id';
import { CancelAppointmentUseCase } from '@/domain/application/use-cases/appointment/cancel-appointment';
import { ConfirmAppointmentUseCase } from '@/domain/application/use-cases/appointment/confirm-appointment';
import { FetchAppointmentsByPatientIdUseCase } from '@/domain/application/use-cases/appointment/fetch-appointments-by-patient-id';

@Module({
  imports: [
    DatabaseModule,
    CryptographyModule,
    EmailModule,
    CacheModule,
    RateLimitModule,
  ],
  controllers: [
    HealthController,
    HealthCheckController,
    AuthenticateUserController,
    RegisterUserController,
    LogoutController,
    SetupMfaController,
    EnableMfaController,
    MfaVerifyLoginController,
    SendEmailVerificationController,
    CreateClinicController,
    EditClinicController,
    ActivateClinicController,
    InactivateClinicController,
    GetClinicByIdController,
    FetchClinicController,
    RegisterFranchiseController,
    EditFranchiseController,
    ActivateFranchiseController,
    InactivateFranchiseController,
    FetchFranchisesByClinicIdController,
    RegisterPatientController,
    EditPatientController,
    GetPatientByIdController,
    FetchPatientsController,
    CreateProfessionalController,
    EditProfessionalController,
    GetProfessionalController,
    GetProfessionalsByFranchiseIdController,
    CreateProcedureController,
    EditProcedureController,
    GetProcedureByIdController,
    FetchProceduresByFranchiseIdController,
    InactivateProcedureController,
    CreateAnamnesisController,
    GetAnamnesisByPatientIdController,
    CancelAppointmentController,
    ConfirmAppointmentController,
    FetchAppointmentsByPatientIdController,
  ],
  providers: [
    { provide: APP_GUARD, useClass: RateLimitGuard },
    AuthenticateUserUseCase,
    RegisterUserUseCase,
    LogoutUseCase,
    SetupMfaUseCase,
    EnableMfaUseCase,
    MfaVerifyLoginUseCase,
    SendEmailVerificationUseCase,
    CreateClinicUseCase,
    EditClinicUseCase,
    ActivateClinicUseCase,
    InactivateClinicUseCase,
    GetClinicByIdUseCase,
    FetchClinicUseCase,
    RegisterFranchiseUseCase,
    EditFranchiseUseCase,
    ActivateFranchiseUseCase,
    InactivateFranchiseUseCase,
    FetchFranchisesByClinicIdUseCase,
    RegisterPatientUseCase,
    EditPatientUseCase,
    GetPatientByIdUseCase,
    FetchPatientsUseCase,
    CreateProfessionalUseCase,
    EditProfessionalUseCase,
    GetProfessionalUseCase,
    GetProfessionalsByFranchiseIdUseCase,
    CreateProcedureUseCase,
    EditProcedureUseCase,
    GetProcedureByIdUseCase,
    FetchProceduresByFranchiseIdUseCase,
    InactivateProcedureUseCase,
    CreateAnamnesisUseCase,
    GetAnamnesisByPatientIdUseCase,
    CancelAppointmentUseCase,
    ConfirmAppointmentUseCase,
    FetchAppointmentsByPatientIdUseCase,
  ],
})
export class HttpModule {}
