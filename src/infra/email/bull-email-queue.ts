import { InjectQueue } from '@nestjs/bull'
import { Injectable, Logger } from '@nestjs/common'
import { Queue } from 'bull'
import { EmailQueue } from '@/shared/services/email/email-queue'

@Injectable()
export class BullEmailQueue extends EmailQueue {
  private readonly logger = new Logger(BullEmailQueue.name)

  constructor(
    @InjectQueue('SEND_EMAIL_QUEUE')
    private readonly emailQueue: Queue,
  ) {
    super()
  }

  async enqueue(data: {
    to: string
    subject: string
    text?: string
    html?: string
    logId?: string
  }): Promise<void> {
    const job = await this.emailQueue.add('send-email', data, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 5000 },
      removeOnComplete: true,
      removeOnFail: false,
    })

    this.logger.log(`Email enqueued para ${data.to} (jobId=${job.id})`)
  }
}

