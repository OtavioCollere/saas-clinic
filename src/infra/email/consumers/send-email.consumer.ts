import { Processor, Process } from '@nestjs/bull'
import { Inject, Injectable, Logger } from '@nestjs/common'
import { Job } from 'bull'
import { EmailSender } from '@/shared/services/email/email-sender'
import { NotificationLogRepository } from '@/domain/application/repositories/notification-log-repository'

interface SendEmailJobData {
  to: string
  subject: string
  text?: string
  html?: string
  logId?: string
}

@Processor('SEND_EMAIL_QUEUE')
@Injectable()
export class SendEmailConsumer {
  private readonly logger = new Logger(SendEmailConsumer.name)

  constructor(
    @Inject(EmailSender)
    private readonly emailSender: EmailSender,
    @Inject(NotificationLogRepository)
    private readonly notificationLogRepository: NotificationLogRepository,
  ) {}

  @Process('send-email')
  async handleSendEmail(job: Job<SendEmailJobData>) {
    const { to, subject, text, html, logId } = job.data

    this.logger.log(`Processando email para ${to} (attempt=${job.attemptsMade + 1})`)

    if (logId) {
      await this.notificationLogRepository.incrementAttempts(logId)
    }

    try {
      await this.emailSender.send({ to, subject, text, html })

      this.logger.log(`Email enviado para ${to} (jobId=${job.id})`)

      if (logId) {
        await this.notificationLogRepository.markSent(logId)
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      this.logger.error(`Erro ao enviar email para ${to}: ${errorMessage}`)

      if (logId) {
        await this.notificationLogRepository.markFailed(logId, errorMessage)
      }

      throw error
    }
  }
}

