import { Injectable, Logger } from '@nestjs/common'
import { Resend } from 'resend'
import { EmailSender } from '@/shared/services/email/email-sender'

@Injectable()
export class ResendEmailSender extends EmailSender {
  private readonly logger = new Logger(ResendEmailSender.name)
  private readonly resend: Resend

  constructor() {
    super()
    this.resend = new Resend(process.env.RESEND_API_KEY)
  }

  async send({ to, subject, text, html }: {
    to: string
    subject: string
    text?: string
    html?: string
  }): Promise<void> {
    this.logger.log(`Enviando email via Resend - to: ${to}, subject: ${subject}`)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await this.resend.emails.send({
      from: 'Cliniker <onboarding@resend.dev>',
      to,
      subject,
      text,
      html,
    } as any)

    if (error) {
      this.logger.error(`Erro ao enviar email via Resend - to: ${to}`, error)
      throw new Error(error.message)
    }

    this.logger.log(`Email enviado com sucesso via Resend - to: ${to}`)
  }
}
