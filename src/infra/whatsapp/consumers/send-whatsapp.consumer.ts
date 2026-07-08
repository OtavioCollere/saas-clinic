import { Processor, Process } from '@nestjs/bull'
import { Inject, Injectable, Logger } from '@nestjs/common'
import { Job } from 'bull'
import { WhatsAppSender, ZApiCredentials } from '@/shared/services/whatsapp/whatsapp-sender'
import { NotificationLogRepository } from '@/domain/application/repositories/notification-log-repository'

interface SendWhatsAppJobData {
  to: string
  message: string
  credentials?: ZApiCredentials
  logId?: string
}

@Processor('SEND_WHATSAPP_QUEUE')
@Injectable()
export class SendWhatsAppConsumer {
  private readonly logger = new Logger(SendWhatsAppConsumer.name)

  constructor(
    @Inject(WhatsAppSender)
    private readonly whatsAppSender: WhatsAppSender,
    @Inject(NotificationLogRepository)
    private readonly notificationLogRepository: NotificationLogRepository,
  ) {}

  @Process('send-whatsapp')
  async handleSendWhatsApp(job: Job<SendWhatsAppJobData>) {
    const { to, message, credentials, logId } = job.data

    this.logger.log(`Processando WhatsApp para ${to} (attempt=${job.attemptsMade + 1})`)

    if (logId) {
      await this.notificationLogRepository.incrementAttempts(logId)
    }

    try {
      await this.whatsAppSender.send({ to, message, credentials })
      this.logger.log(`WhatsApp enviado para ${to}`)

      if (logId) {
        await this.notificationLogRepository.markSent(logId)
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      this.logger.error(`Erro ao enviar WhatsApp para ${to}: ${errorMessage}`)

      if (logId) {
        await this.notificationLogRepository.markFailed(logId, errorMessage)
      }

      throw error
    }
  }
}
