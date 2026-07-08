import { Module } from '@nestjs/common'
import { BullModule } from '@nestjs/bull'
import { DatabaseModule } from '../database/database.module'
import { EmailSender } from '@/shared/services/email/email-sender'
import { EmailQueue } from '@/shared/services/email/email-queue'
import { ResendEmailSender } from './resend-email-sender'
import { BullEmailQueue } from './bull-email-queue'
import { SendEmailConsumer } from './consumers/send-email.consumer'

@Module({
  imports: [
    BullModule.registerQueue({ name: 'SEND_EMAIL_QUEUE' }),
    DatabaseModule,
  ],
  providers: [
    {
      provide: EmailSender,
      useClass: ResendEmailSender,
    },
    {
      provide: EmailQueue,
      useClass: BullEmailQueue,
    },
    SendEmailConsumer,
  ],
  exports: [EmailQueue, EmailSender],
})
export class EmailModule {}
