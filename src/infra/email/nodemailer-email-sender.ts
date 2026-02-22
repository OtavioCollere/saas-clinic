import { Inject, Injectable } from '@nestjs/common'
import { EmailSender } from '@/shared/services/email/email-sender'
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
    const info = await this.transporter.sendMail({
      from: 'Free foo <foo@example.com>',
      to,
      subject,
      text,
      html,
    });

    // Mostra a URL de preview do Ethereal Email para testes
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log('🔗 Email preview URL:', previewUrl);
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

