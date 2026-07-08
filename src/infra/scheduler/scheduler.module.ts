import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'
import { EmailModule } from '../email/email.module'
import { WhatsAppModule } from '../whatsapp/whatsapp.module'
import { AppointmentReminderScheduler } from './appointment-reminder.scheduler'
import { SchedulerTestController } from './scheduler-test.controller'

@Module({
  imports: [DatabaseModule, EmailModule, WhatsAppModule],
  controllers: [SchedulerTestController],
  providers: [AppointmentReminderScheduler],
})
export class SchedulerModule {}
