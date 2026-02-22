import { Processor, Process } from '@nestjs/bull'
import { Inject, Injectable } from '@nestjs/common'
import { Job } from 'bull'
import { EmailSender } from '@/shared/services/email/email-sender'

interface SendEmailJobData {
  to: string
  subject: string
  text?: string
  html?: string
}

@Processor('SEND_EMAIL_QUEUE')
@Injectable()
export class SendEmailConsumer {
  constructor(
    @Inject(EmailSender)
    private readonly emailSender: EmailSender,
  ) {}

  @Process('send-email')
  async handleSendEmail(job: Job<SendEmailJobData>) {
    const { to, subject, text, html } = job.data;
    await this.emailSender.send({ to, subject, text, html });
  }
}

