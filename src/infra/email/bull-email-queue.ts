import { InjectQueue } from '@nestjs/bull'
import { Injectable } from '@nestjs/common'
import { Queue } from 'bull'
import { EmailQueue } from '@/core/services/email/email-queue'

@Injectable()
export class BullEmailQueue extends EmailQueue {
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
  }): Promise<void> {
    await this.emailQueue.add('send-email', data)
  }
}

