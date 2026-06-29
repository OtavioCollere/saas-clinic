import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EmailQueue } from '@/shared/services/email/email-queue';
import { StaffMemberCreatedEvent } from '@/domain/enterprise/events/staff-member-created.event';

const APP_URL = process.env["APP_URL"] ?? 'https://cliniker.com.br';

function formatExpiry(date: Date): string {
  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Sao_Paulo',
  });
}

function buildStaffEmail(email: string, password: string, expiresAt: Date): string {
  const expiry = formatExpiry(expiresAt);
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Bem-vindo ao Cliniker</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">
          <tr>
            <td style="background:#7C3AED;border-radius:12px 12px 0 0;padding:36px 40px;text-align:center;">
              <div style="display:inline-block;background:rgba(255,255,255,0.15);border-radius:50%;width:52px;height:52px;line-height:52px;font-size:24px;font-weight:bold;color:#fff;margin-bottom:12px;">+</div>
              <div style="color:#fff;font-size:26px;font-weight:bold;letter-spacing:-0.5px;">Cliniker</div>
              <div style="color:#bfdbfe;font-size:13px;margin-top:4px;">Sistema de Gestão Clínica</div>
            </td>
          </tr>
          <tr>
            <td style="background:#fff;border-radius:0 0 12px 12px;padding:36px 40px;box-shadow:0 4px 16px rgba(0,0,0,0.06);">
              <h2 style="margin:0 0 8px;color:#0f172a;font-size:22px;">Bem-vindo à equipe! 👋</h2>
              <p style="margin:0 0 24px;color:#475569;font-size:15px;line-height:1.6;">
                Seu acesso ao <strong>Cliniker</strong> foi criado. Use as credenciais abaixo para entrar no sistema pela primeira vez.
              </p>
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:20px;margin-bottom:20px;">
                <tr>
                  <td style="padding:0 20px 16px;">
                    <div style="font-size:11px;font-weight:bold;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">Email de acesso</div>
                    <div style="font-size:15px;color:#1e293b;font-weight:600;">${email}</div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0 20px;border-top:1px solid #e2e8f0;padding-top:16px;">
                    <div style="font-size:11px;font-weight:bold;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">Senha temporária</div>
                    <div style="font-size:18px;color:#1e293b;font-weight:700;font-family:monospace;letter-spacing:2px;background:#fff;border:1px dashed #cbd5e1;border-radius:6px;padding:10px 14px;display:inline-block;">${password}</div>
                  </td>
                </tr>
              </table>
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#fffbeb;border:1px solid #fbbf24;border-radius:10px;padding:16px;margin-bottom:28px;">
                <tr>
                  <td style="padding:0 16px;">
                    <div style="font-size:13px;color:#92400e;line-height:1.5;">
                      ⚠️ <strong>Atenção:</strong> esta senha expira em <strong>${expiry}</strong> (72 horas). Faça seu primeiro acesso antes deste prazo e altere sua senha.
                    </div>
                  </td>
                </tr>
              </table>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding-bottom:28px;">
                    <a href="${APP_URL}" style="display:inline-block;background:#7C3AED;color:#fff;font-size:15px;font-weight:bold;text-decoration:none;padding:14px 40px;border-radius:8px;letter-spacing:0.2px;">
                      Acessar o Cliniker
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin:0;font-size:13px;color:#94a3b8;text-align:center;line-height:1.5;">
                Se você não esperava este email, pode ignorá-lo com segurança.
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
</html>`;
}

@Injectable()
export class OnStaffMemberCreated {
  constructor(
    @Inject(EmailQueue)
    private readonly emailQueue: EmailQueue,
  ) {}

  @OnEvent('staff-member.created')
  async handle(event: StaffMemberCreatedEvent) {
    try {
      await this.emailQueue.enqueue({
        to: event.userEmail,
        subject: 'Bem-vindo ao Cliniker — suas credenciais de acesso',
        html: buildStaffEmail(event.userEmail, event.password, event.expiresAt),
        text: `Bem-vindo ao Cliniker!\n\nSeu acesso foi criado.\n\nEmail: ${event.userEmail}\nSenha temporária: ${event.password}\n\nEsta senha expira em: ${formatExpiry(event.expiresAt)}\n\nAcesse em: ${APP_URL}`,
      });
    } catch (error) {
      console.error('Erro ao enviar email de boas-vindas (staff):', error);
    }
  }
}
