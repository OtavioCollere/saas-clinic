import { InjectQueue } from '@nestjs/bull'
import { Injectable } from '@nestjs/common'
import { Queue } from 'bull'
import { EmailQueue } from '@/shared/services/email/email-queue'

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
    console.log('📬 BullEmailQueue: Adicionando job à fila SEND_EMAIL_QUEUE', {
      to: data.to,
      subject: data.subject,
      hasText: !!data.text,
      hasHtml: !!data.html,
    });

    const job = await this.emailQueue.add('send-email', data);
    
    console.log('✅ BullEmailQueue: Job adicionado com sucesso', {
      jobId: job.id,
      jobName: job.name,
      queueName: 'SEND_EMAIL_QUEUE',
    });
  }
}

