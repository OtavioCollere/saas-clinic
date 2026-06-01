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
    console.log('🔄 SendEmailConsumer: Job recebido para processamento', {
      jobId: job.id,
      jobName: job.name,
      attempt: job.attemptsMade + 1,
      data: {
        to: job.data.to,
        subject: job.data.subject,
        hasText: !!job.data.text,
        hasHtml: !!job.data.html,
      },
    });

    try {
      const { to, subject, text, html } = job.data;
      
      console.log('📤 SendEmailConsumer: Enviando email via EmailSender...');
      
      await this.emailSender.send({ to, subject, text, html });
      
      console.log('✅ SendEmailConsumer: Email enviado com sucesso', {
        to,
        subject,
        jobId: job.id,
      });
    } catch (error) {
      console.error('❌ SendEmailConsumer: Erro ao enviar email', {
        jobId: job.id,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
      throw error;
    }
  }
}

