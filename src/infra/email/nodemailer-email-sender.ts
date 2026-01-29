import { Inject, Injectable } from '@nestjs/common'
import { EmailSender } from '@/core/services/email/email-sender'
import * as nodemailer from 'nodemailer'

@Injectable()
export class NodemailerEmailSender extends EmailSender {
  constructor(
    @Inject('NODEMAILER_TRANSPORTER')
    private readonly transporter: nodemailer.Transporter,
  ) {
    super()
  }

  async send({ to, subject, text, html }: {
    to: string
    subject: string
    text?: string
    html?: string
  }): Promise<void> {
    await this.transporter.sendMail({
      from: 'Free foo <foo@example.com>',
      to,
      subject,
      text,
      html,
    })
  }
}

