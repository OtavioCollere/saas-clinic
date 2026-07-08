import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { ListClinicsController } from './controlers/admin/list-clinics.controller';
import { GetClinicController } from './controlers/admin/get-clinic.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [ListClinicsController, GetClinicController],
})
export class AdminModule {}
