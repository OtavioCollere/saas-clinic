import { Module } from '@nestjs/common'
import { BullModule } from '@nestjs/bull'
import { EmailSender } from '@/shared/services/email/email-sender'
import { EmailQueue } from '@/shared/services/email/email-queue'
import { NodemailerEmailSender } from './nodemailer-email-sender'
import { BullEmailQueue } from './bull-email-queue'
import { SendEmailConsumer } from './consumers/send-email.consumer'
import { createNodemailerTransporter } from './nodemailer.provider'

@Module({
  imports: [
    BullModule.registerQueue({ name: 'SEND_EMAIL_QUEUE' }),
  ],
  providers: [
    {
      provide: 'NODEMAILER_TRANSPORTER',
      useFactory: createNodemailerTransporter,
    },
    {
      provide: EmailSender,
      useClass: NodemailerEmailSender,
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
