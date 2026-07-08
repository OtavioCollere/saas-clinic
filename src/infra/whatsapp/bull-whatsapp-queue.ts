import { Inject, Injectable, Logger } from '@nestjs/common'
import { InjectQueue } from '@nestjs/bull'
import { Queue } from 'bull'
import { WhatsAppQueue } from '@/shared/services/whatsapp/whatsapp-queue'
import { ZApiCredentials } from '@/shared/services/whatsapp/whatsapp-sender'

@Injectable()
export class BullWhatsAppQueue implements WhatsAppQueue {
  private readonly logger = new Logger(BullWhatsAppQueue.name)

  constructor(
    @InjectQueue('SEND_WHATSAPP_QUEUE')
    private readonly whatsappQueue: Queue,
  ) {}

  async enqueue(data: {
    to: string
    message: string
    credentials?: ZApiCredentials
    logId?: string
  }): Promise<void> {
    const jobId = `wa-${data.to}-${Date.now()}`
    await this.whatsappQueue.add('send-whatsapp', data, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 5000 },
      removeOnComplete: true,
      removeOnFail: false,
      jobId,
    })
    this.logger.log(`WhatsApp enqueued para ${data.to}`)
  }
}
