import { Inject, Injectable, Logger } from '@nestjs/common'
import { EmailSender } from '@/shared/services/email/email-sender'
import * as nodemailer from 'nodemailer'

@Injectable()
export class NodemailerEmailSender extends EmailSender {
  private readonly logger = new Logger(NodemailerEmailSender.name)

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
    this.logger.log(
      `Preparando envio de email - to: ${to}, subject: ${subject}`,
    )

    try {
      const info = await this.transporter.sendMail({
        from: 'Free foo <foo@example.com>',
        to,
        subject,
        text,
        html,
      });

      this.logger.log(
        `Email enviado com sucesso - to: ${to}, subject: ${subject}`,
      )

      // Se estiver usando Ethereal Email, mostra a URL de preview (IMPORTANTE: use este link para ver o email)
      const previewUrl = nodemailer.getTestMessageUrl(info)
      if (previewUrl) {
        this.logger.log(
          `🔗 URL de preview do Ethereal Email (acesse para ver o email): ${previewUrl}`,
        )
      }
    } catch (error) {
      this.logger.error(
        `Erro ao enviar email - to: ${to}, subject: ${subject}`,
        error instanceof Error ? error.stack : String(error),
      )
      throw error
    }
  }

  async sendWelcomeEmail(email: string, password: string): Promise<void> {
    await this.send({
      to: email,
      subject: 'Bem vindo ao Cliniker',
      html: `
        <h1>Bem vindo ao Cliniker</h1>
        <p>Sua senha de acesso é: ${password}</p>
        <p>Você pode acessar o sistema em <a href="https://cliniker.com.br">https://cliniker.com.br</a></p>
        <p>Se você não solicitou este acesso, por favor, ignore este email.</p>
      `,
    })
  }
}

