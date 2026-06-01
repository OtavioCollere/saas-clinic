import { Module } from "@nestjs/common";
import { FetchAppointmentsByClinicIdController } from "./controlers/appointment/fetch-appointments-by-clinic-id.controller";
import { FetchAppointmentHistoryByClinicIdController } from "./controlers/appointment/fetch-appointment-history-by-clinic-id.controller";
import { FetchAppointmentsByClinicIdWeekController } from "./controlers/appointment/fetch-appointments-by-clinic-id-week.controller";
import { FetchProceduresByClinicIdController } from "./controlers/procedure/fetch-procedures-by-clinic-id.controller";
import { FetchPatientsByClinicIdController } from "./controlers/patient/fetch-patients-by-clinic-id.controller";
import { FetchAppointmentsByClinicIdUseCase } from "@/domain/application/use-cases/appointment/fetch-appointments-by-clinic-id";
import { FetchAppointmentHistoryByClinicIdUseCase } from "@/domain/application/use-cases/appointment/fetch-appointment-history-by-clinic-id";
import { FetchAppointmentsByClinicIdWeekUseCase } from "@/domain/application/use-cases/appointment/fetch-appointments-by-clinic-id-week";
import { FetchProceduresByClinicIdUseCase } from "@/domain/application/use-cases/procedure/fetch-procedures-by-clinic-id";
import { FetchPatientsByClinicIdUseCase } from "@/domain/application/use-cases/patient/fetch-patients-by-clinic-id";
import { DatabaseModule } from "../database/database.module";

@Module({
  imports: [DatabaseModule],
  controllers: [
    FetchAppointmentHistoryByClinicIdController,
    FetchAppointmentsByClinicIdController,
    FetchAppointmentsByClinicIdWeekController,
    FetchProceduresByClinicIdController,
    FetchPatientsByClinicIdController,
  ],
  providers: [
    FetchAppointmentsByClinicIdUseCase,
    FetchAppointmentHistoryByClinicIdUseCase,
    FetchAppointmentsByClinicIdWeekUseCase,
    FetchProceduresByClinicIdUseCase,
    FetchPatientsByClinicIdUseCase,
  ],
  exports: [
    FetchAppointmentsByClinicIdUseCase,
    FetchAppointmentHistoryByClinicIdUseCase,
    FetchAppointmentsByClinicIdWeekUseCase,
    FetchProceduresByClinicIdUseCase,
    FetchPatientsByClinicIdUseCase,
  ],
})
export class ClinicsHttpModule {}
