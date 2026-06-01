import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { DatabaseModule } from '../database/database.module';
import { EmailModule } from '../email/email.module';
import { CryptographyModule } from '../cryptography/cryptography.module';
// import { CacheModule } from '../cache/cache.module';
import { RateLimitModule } from '../rate-limit/rate-limit.module';
import { RateLimitGuard } from '@/shared/guards/rate-limit.guard';
import { AuthModule } from '../auth/auth.module';
import { ClinicsHttpModule } from './clinics-http.module';
import { WhatsAppModule } from '../whatsapp/whatsapp.module';
import { WhatsappWebhookController } from './controlers/whatsapp/whatsapp-webhook.controller';

// Controllers
import { HealthCheckController } from './controlers/health/health-check.controller';
import { AuthenticateUserController } from './controlers/users/authenticate-user.controller';
import { RegisterUserController } from './controlers/users/register-user.controller';
import { LogoutController } from './controlers/users/logout.controller';
import { MeController } from './controlers/users/me.controller';
import { GetPatientByUserIdController } from './controlers/users/get-patient-by-user-id.controller';
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
import { GetUsersByClinicIdController } from './controlers/clinic/get-users-by-clinic-id.controller';
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
import { GetProfessionalsByClinicIdController } from './controlers/professional/get-professionals-by-clinic-id.controller';
import { CreateProcedureController } from './controlers/procedure/create-procedure.controller';
import { EditProcedureController } from './controlers/procedure/edit-procedure.controller';
import { GetProcedureByIdController } from './controlers/procedure/get-procedure-by-id.controller';
import { FetchProceduresByFranchiseIdController } from './controlers/procedure/fetch-procedures-by-franchise-id.controller';
import { InactivateProcedureController } from './controlers/procedure/inactivate-procedure.controller';
import { DeleteProcedureController } from './controlers/procedure/delete-procedure.controller';
import { CreateAnamnesisController } from './controlers/anamnesis/create-anamnesis.controller';
import { GetAnamnesisByPatientIdController } from './controlers/anamnesis/get-anamnesis-by-patient-id.controller';
import { CancelAppointmentController } from './controlers/appointment/cancel-appointment.controller';
import { ConfirmAppointmentController } from './controlers/appointment/confirm-appointment.controller';
import { CreateAppointmentController } from './controlers/appointment/create-appointment.controller';
import { FetchAppointmentsByPatientIdController } from './controlers/appointment/fetch-appointments-by-patient-id.controller';
import { FetchAppointmentsByProfessionalIdController } from './controlers/appointment/fetch-appointments-by-professional-id.controller';
import { GetAppointmentByIdController } from './controlers/appointment/get-appointment-by-id.controller';
import { EditAppointmentController } from './controlers/appointment/edit-appointment.controller';
import { CreateServiceOrderController } from './controlers/service-order/create-service-order.controller';
import { CreateProductController } from './controlers/product/create-product.controller';
import { GetProductByIdController } from './controlers/product/get-product-by-id.controller';
import { FetchProductsByFranchiseIdController } from './controlers/product/fetch-products-by-franchise-id.controller';
import { FetchProductsByClinicIdController } from './controlers/product/fetch-products-by-clinic-id.controller';
import { EditProductController } from './controlers/product/edit-product.controller';
import { InactivateProductController } from './controlers/product/inactivate-product.controller';
import { DeleteProductController } from './controlers/product/delete-product.controller';
import { GetDashboardStatsController } from './controlers/clinic/get-dashboard-stats.controller';
import { CreateStaffMemberController } from './controlers/clinic/create-staff-member.controller';
import { PublicBookingController } from './controlers/booking/public-booking.controller';
import { CreateInventoryItemController } from './controlers/inventory/create-inventory-item.controller';
import { UpdateInventoryItemController } from './controlers/inventory/update-inventory-item.controller';
import { ListInventoryItemsController } from './controlers/inventory/list-inventory-items.controller';
import { CreateInventoryEntryController } from './controlers/inventory/create-inventory-entry.controller';
import { UpsertProcedureSupplyTemplateController } from './controlers/inventory/upsert-procedure-supply-template.controller';
import { ListProcedureSupplyTemplatesController } from './controlers/inventory/list-procedure-supply-templates.controller';
import { DeleteProcedureSupplyTemplateController } from './controlers/inventory/delete-procedure-supply-template.controller';
import { GetConsumptionSuggestionController } from './controlers/inventory/get-consumption-suggestion.controller';
import { ConfirmConsumptionController } from './controlers/inventory/confirm-consumption.controller';
import { OnboardClinicController } from './controlers/admin/onboard-clinic.controller';

// Use Cases
import { AuthenticateUserUseCase } from '@/domain/application/use-cases/users/authenticate-user';
import { RegisterUserUseCase } from '@/domain/application/use-cases/users/register-user';
import { LogoutUseCase } from '@/domain/application/use-cases/users/logout';
import { GetCurrentUserUseCase } from '@/domain/application/use-cases/users/get-current-user';
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
import { GetUsersByClinicIdUseCase } from '@/domain/application/use-cases/clinic/get-users-by-clinic-id';
import { RegisterFranchiseUseCase } from '@/domain/application/use-cases/franchise/register-franchise';
import { EditFranchiseUseCase } from '@/domain/application/use-cases/franchise/edit-franchise';
import { ActivateFranchiseUseCase } from '@/domain/application/use-cases/franchise/activate-franchise';
import { InactivateFranchiseUseCase } from '@/domain/application/use-cases/franchise/inactivate-franchise';
import { FetchFranchisesByClinicIdUseCase } from '@/domain/application/use-cases/franchise/fetch-franchises-by-clinic-id';
import { RegisterPatientUseCase } from '@/domain/application/use-cases/patient/register-patient';
import { EditPatientUseCase } from '@/domain/application/use-cases/patient/edit-patient';
import { GetPatientByIdUseCase } from '@/domain/application/use-cases/patient/get-patient-by-id';
import { GetPatientByUserIdUseCase } from '@/domain/application/use-cases/patient/get-patient-by-user-id';
import { FetchPatientsUseCase } from '@/domain/application/use-cases/patient/fetch-patients';
import { CreateProfessionalUseCase } from '@/domain/application/use-cases/professional/create-professional';
import { EditProfessionalUseCase } from '@/domain/application/use-cases/professional/edit-professional';
import { GetProfessionalUseCase } from '@/domain/application/use-cases/professional/get-professional';
import { GetProfessionalsByFranchiseIdUseCase } from '@/domain/application/use-cases/professional/get-professionals-by-franchise-id';
import { GetProfessionalsByClinicIdUseCase } from '@/domain/application/use-cases/professional/get-professionals-by-clinic-id';
import { CreateProcedureUseCase } from '@/domain/application/use-cases/procedure/create-procedure';
import { EditProcedureUseCase } from '@/domain/application/use-cases/procedure/edit-procedure';
import { GetProcedureByIdUseCase } from '@/domain/application/use-cases/procedure/get-procedure-by-id';
import { FetchProceduresByFranchiseIdUseCase } from '@/domain/application/use-cases/procedure/fetch-procedures-by-franchise-id';
import { InactivateProcedureUseCase } from '@/domain/application/use-cases/procedure/inactivate-procedure';
import { DeleteProcedureUseCase } from '@/domain/application/use-cases/procedure/delete-procedure';
import { CreateAnamnesisUseCase } from '@/domain/application/use-cases/anamnesis/create-anamnesis';
import { GetAnamnesisByPatientIdUseCase } from '@/domain/application/use-cases/anamnesis/get-anamnesis-by-patient-id';
import { CancelAppointmentUseCase } from '@/domain/application/use-cases/appointment/cancel-appointment';
import { ConfirmAppointmentUseCase } from '@/domain/application/use-cases/appointment/confirm-appointment';
import { CreateAppointmentUseCase } from '@/domain/application/use-cases/appointment/create-appointment';
import { FetchAppointmentsByPatientIdUseCase } from '@/domain/application/use-cases/appointment/fetch-appointments-by-patient-id';
import { FetchAppointmentsByProfessionalIdUseCase } from '@/domain/application/use-cases/appointment/fetch-appointments-by-professional-id';
import { GetAppointmentByIdUseCase } from '@/domain/application/use-cases/appointment/get-appointment-by-id';
import { EditAppointmentUseCase } from '@/domain/application/use-cases/appointment/edit-appointment';
import { CreateServiceOrderUseCase } from '@/domain/application/use-cases/service-order/create-service-order';
import { CreateProductUseCase } from '@/domain/application/use-cases/product/create-product';
import { GetProductByIdUseCase } from '@/domain/application/use-cases/product/get-product-by-id';
import { FetchProductsByFranchiseIdUseCase } from '@/domain/application/use-cases/product/fetch-products-by-franchise-id';
import { FetchProductsByClinicIdUseCase } from '@/domain/application/use-cases/product/fetch-products-by-clinic-id';
import { EditProductUseCase } from '@/domain/application/use-cases/product/edit-product';
import { InactivateProductUseCase } from '@/domain/application/use-cases/product/inactivate-product';
import { DeleteProductUseCase } from '@/domain/application/use-cases/product/delete-product';
import { GetDashboardStatsUseCase } from '@/domain/application/use-cases/clinic/get-dashboard-stats';
import { CreateStaffMemberUseCase } from '@/domain/application/use-cases/clinic/create-staff-member';
import { CreateInventoryItemUseCase } from '@/domain/application/use-cases/inventory/create-inventory-item';
import { UpdateInventoryItemUseCase } from '@/domain/application/use-cases/inventory/update-inventory-item';
import { ListInventoryItemsByClinicUseCase } from '@/domain/application/use-cases/inventory/list-inventory-items-by-clinic';
import { CreateInventoryEntryUseCase } from '@/domain/application/use-cases/inventory/create-inventory-entry';
import { UpsertProcedureSupplyTemplateUseCase } from '@/domain/application/use-cases/inventory/upsert-procedure-supply-template';
import { ListProcedureSupplyTemplatesUseCase } from '@/domain/application/use-cases/inventory/list-procedure-supply-templates';
import { DeleteProcedureSupplyTemplateUseCase } from '@/domain/application/use-cases/inventory/delete-procedure-supply-template';
import { GetConsumptionSuggestionUseCase } from '@/domain/application/use-cases/inventory/get-consumption-suggestion';
import { ConfirmConsumptionUseCase } from '@/domain/application/use-cases/inventory/confirm-consumption';
import { OnboardClinicUseCase } from '@/domain/application/use-cases/admin/onboard-clinic';
import { OnAppointmentConfirmed } from '../events/on-appointment-confirmed';
import { HandleWhatsAppMessageUseCase } from '@/domain/application/use-cases/whatsapp/handle-whatsapp-message';

@Module({
  imports: [
    DatabaseModule,
    CryptographyModule,
    EmailModule,
    WhatsAppModule,
    RateLimitModule,
    AuthModule,
    ClinicsHttpModule,
  ],
  controllers: [
    HealthCheckController,
    AuthenticateUserController,
    RegisterUserController,
    LogoutController,
    MeController,
    GetPatientByUserIdController,
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
    GetUsersByClinicIdController,
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
    GetProfessionalsByClinicIdController,
    CreateProcedureController,
    EditProcedureController,
    GetProcedureByIdController,
    FetchProceduresByFranchiseIdController,
    InactivateProcedureController,
    DeleteProcedureController,
    CreateAnamnesisController,
    GetAnamnesisByPatientIdController,
    CancelAppointmentController,
    ConfirmAppointmentController,
    CreateAppointmentController,
    FetchAppointmentsByPatientIdController,
    FetchAppointmentsByProfessionalIdController,
    GetAppointmentByIdController,
    EditAppointmentController,
    CreateServiceOrderController,
    CreateProductController,
    GetProductByIdController,
    FetchProductsByFranchiseIdController,
    FetchProductsByClinicIdController,
    EditProductController,
    InactivateProductController,
    DeleteProductController,
    GetDashboardStatsController,
    CreateStaffMemberController,
    PublicBookingController,
    WhatsappWebhookController,
    CreateInventoryItemController,
    UpdateInventoryItemController,
    ListInventoryItemsController,
    CreateInventoryEntryController,
    UpsertProcedureSupplyTemplateController,
    ListProcedureSupplyTemplatesController,
    DeleteProcedureSupplyTemplateController,
    GetConsumptionSuggestionController,
    ConfirmConsumptionController,
    OnboardClinicController,
  ],
  providers: [
    { provide: APP_GUARD, useClass: RateLimitGuard },
    AuthenticateUserUseCase,
    RegisterUserUseCase,
    LogoutUseCase,
    GetCurrentUserUseCase,
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
    GetUsersByClinicIdUseCase,
    RegisterFranchiseUseCase,
    EditFranchiseUseCase,
    ActivateFranchiseUseCase,
    InactivateFranchiseUseCase,
    FetchFranchisesByClinicIdUseCase,
    RegisterPatientUseCase,
    EditPatientUseCase,
    GetPatientByIdUseCase,
    GetPatientByUserIdUseCase,
    FetchPatientsUseCase,
    CreateProfessionalUseCase,
    EditProfessionalUseCase,
    GetProfessionalUseCase,
    GetProfessionalsByFranchiseIdUseCase,
    GetProfessionalsByClinicIdUseCase,
    CreateProcedureUseCase,
    EditProcedureUseCase,
    GetProcedureByIdUseCase,
    FetchProceduresByFranchiseIdUseCase,
    InactivateProcedureUseCase,
    DeleteProcedureUseCase,
    CreateAnamnesisUseCase,
    GetAnamnesisByPatientIdUseCase,
    CancelAppointmentUseCase,
    ConfirmAppointmentUseCase,
    CreateAppointmentUseCase,
    FetchAppointmentsByPatientIdUseCase,
    FetchAppointmentsByProfessionalIdUseCase,
    GetAppointmentByIdUseCase,
    EditAppointmentUseCase,
    CreateServiceOrderUseCase,
    CreateProductUseCase,
    GetProductByIdUseCase,
    FetchProductsByFranchiseIdUseCase,
    FetchProductsByClinicIdUseCase,
    EditProductUseCase,
    InactivateProductUseCase,
    DeleteProductUseCase,
    GetDashboardStatsUseCase,
    CreateStaffMemberUseCase,
    CreateInventoryItemUseCase,
    UpdateInventoryItemUseCase,
    ListInventoryItemsByClinicUseCase,
    CreateInventoryEntryUseCase,
    UpsertProcedureSupplyTemplateUseCase,
    ListProcedureSupplyTemplatesUseCase,
    DeleteProcedureSupplyTemplateUseCase,
    GetConsumptionSuggestionUseCase,
    ConfirmConsumptionUseCase,
    OnboardClinicUseCase,
    OnAppointmentConfirmed,
    HandleWhatsAppMessageUseCase,
  ],
})
export class HttpModule {}
