import { Injectable } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';
import { EmailService } from '@/core/services/email.service';
import type { EnvService } from '../env/env.service';

@Injectable()
export class SendgridEmailService implements EmailService {
  constructor(private env: EnvService) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
  }

  async sendEmailVerification({
    to,
    token,
  }: {
    to: string;
    token: string;
  }): Promise<void> {
    const link = `${this.env.get('EMAIL_VERIFY_URL')}?token=${token}`;

    await sgMail.send({
      to,
      from: process.env.EMAIL_FROM!,
      subject: 'Confirme seu e-mail',
      html: `
        <h2>Confirmação de e-mail</h2>
        <p>Clique no link abaixo para confirmar seu e-mail:</p>
        <a href="${link}">Confirmar e-mail</a>
      `,
    });
  }
}
