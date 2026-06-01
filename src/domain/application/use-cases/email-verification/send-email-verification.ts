import { makeLeft, makeRight } from '@/shared/either/either';
import { UsersRepository } from '../../repositories/users-repository';
import { UserNotFoundError } from '@/shared/errors/user-not-found-error';
import { EmailQueue } from '@/shared/services/email/email-queue';
import { Inject, Injectable } from '@nestjs/common';
import { EmailVerificationRepository } from '../../repositories/email-verification-repository';
import { EmailVerification } from '@/domain/enterprise/entities/email-verification';
import crypto from 'crypto';

export interface SendEmailVerificationUseCaseRequest {
  userId: string;
}

@Injectable()
export class SendEmailVerificationUseCase {
  constructor(
    @Inject(UsersRepository)
    private usersRepository: UsersRepository,
    @Inject(EmailQueue)
    private emailQueue: EmailQueue,
    @Inject(EmailVerificationRepository)
    private emailVerificationRepository: EmailVerificationRepository,
  ) {}

  async execute({ userId }: SendEmailVerificationUseCaseRequest) {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      return makeLeft(new UserNotFoundError());
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60);

    const emailVerification = EmailVerification.create({
      userId: user.id,
      email: user.email,
      token,
      expiresAt,
    });

    await this.emailVerificationRepository.transaction(async (tx) => {
      await this.emailVerificationRepository.deleteAllByUserId(
        user.id.toString(),
        tx,
      );

      await this.emailVerificationRepository.create(emailVerification, tx);
    });

    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? 'https://cliniker.com.br'}/verify-email?token=${token}`;
    const expiryFormatted = expiresAt.toLocaleString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
      timeZone: 'America/Sao_Paulo',
    });

    await this.emailQueue.enqueue({
      to: user.email.getValue(),
      subject: 'Cliniker — confirme seu endereço de email',
      html: `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Confirme seu email</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">
          <tr>
            <td style="background:#1D4ED8;border-radius:12px 12px 0 0;padding:36px 40px;text-align:center;">
              <div style="display:inline-block;background:rgba(255,255,255,0.15);border-radius:50%;width:52px;height:52px;line-height:52px;font-size:24px;font-weight:bold;color:#fff;margin-bottom:12px;">+</div>
              <div style="color:#fff;font-size:26px;font-weight:bold;letter-spacing:-0.5px;">Cliniker</div>
              <div style="color:#bfdbfe;font-size:13px;margin-top:4px;">Sistema de Gestão Clínica</div>
            </td>
          </tr>
          <tr>
            <td style="background:#fff;border-radius:0 0 12px 12px;padding:36px 40px;box-shadow:0 4px 16px rgba(0,0,0,0.06);">
              <h2 style="margin:0 0 8px;color:#0f172a;font-size:22px;">Confirme seu email</h2>
              <p style="margin:0 0 24px;color:#475569;font-size:15px;line-height:1.6;">
                Clique no botão abaixo para verificar seu endereço de email e ativar o acesso à sua conta.
              </p>
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#fffbeb;border:1px solid #fbbf24;border-radius:10px;margin-bottom:28px;">
                <tr>
                  <td style="padding:14px 20px;">
                    <div style="font-size:13px;color:#92400e;line-height:1.5;">
                      ⚠️ Este link é válido por <strong>1 hora</strong> e expira em <strong>${expiryFormatted}</strong>.
                    </div>
                  </td>
                </tr>
              </table>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding-bottom:28px;">
                    <a href="${verificationUrl}"
                       style="display:inline-block;background:#1D4ED8;color:#fff;font-size:15px;font-weight:bold;text-decoration:none;padding:14px 40px;border-radius:8px;letter-spacing:0.2px;">
                      Verificar meu email
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin:0 0 8px;font-size:13px;color:#94a3b8;text-align:center;">Ou copie e cole o link abaixo no navegador:</p>
              <p style="margin:0;font-size:12px;color:#64748b;text-align:center;word-break:break-all;">${verificationUrl}</p>
              <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0;" />
              <p style="margin:0;font-size:13px;color:#94a3b8;text-align:center;">
                Se você não solicitou este email, pode ignorá-lo com segurança.
              </p>
            </td>
          </tr>
          <tr>
            <td style="text-align:center;padding:20px 0 4px;">
              <p style="margin:0;font-size:12px;color:#94a3b8;">© ${new Date().getFullYear()} Cliniker · Sistema de Gestão Clínica</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
      text: `Confirme seu email no Cliniker.\n\nClique no link abaixo para verificar sua conta:\n${verificationUrl}\n\nEste link expira em: ${expiryFormatted} (1 hora).\n\nSe você não solicitou este email, ignore-o.`,
    });

    return makeRight({
      message : 'If you have an account with this email, you will receive an email to verify your account.',
    });
  }
}
