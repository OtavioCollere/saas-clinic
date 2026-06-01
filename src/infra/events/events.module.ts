import { Module } from "@nestjs/common";
import { OnProfessionalCreated } from "./on-professional-created";
import { OnPatientCreated } from "./on-patient-created";
import { OnAppointmentCancelled } from "./on-appointment-cancelled";
import { OnAppointmentCreated } from "./on-appointment-created";
import { OnAppointmentConfirmed } from "./on-appointment-confirmed";
import { OnStaffMemberCreated } from "./on-staff-member-created";
import { OnClinicOwnerOnboarded } from "./on-clinic-owner-onboarded";
import { EmailModule } from "../email/email.module";
import { WhatsAppModule } from "../whatsapp/whatsapp.module";
import { DatabaseModule } from "../database/database.module";
import { CreateServiceOrderUseCase } from "@/domain/application/use-cases/service-order/create-service-order";

@Module({
  imports: [EmailModule, WhatsAppModule, DatabaseModule],
  providers: [
    OnProfessionalCreated,
    OnPatientCreated,
    OnAppointmentCancelled,
    OnAppointmentCreated,
    OnAppointmentConfirmed,
    OnStaffMemberCreated,
    OnClinicOwnerOnboarded,
    CreateServiceOrderUseCase,
  ],
})
export class EventsModule {}
