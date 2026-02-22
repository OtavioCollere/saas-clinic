import { Module } from "@nestjs/common";
import { OnProfessionalCreated } from "./on-professional-created";
import { OnPatientCreated } from "./on-patient-created";
import { EmailModule } from "../email/email.module";
import { DatabaseModule } from "../database/database.module";

@Module({
  imports: [EmailModule, DatabaseModule],
  providers: [OnProfessionalCreated, OnPatientCreated],
})
export class EventsModule {}
