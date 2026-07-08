import { Inject, Injectable, Logger } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { EmailQueue } from '@/shared/services/email/email-queue'
import { WhatsAppQueue } from '@/shared/services/whatsapp/whatsapp-queue'
import { NotificationLogRepository } from '@/domain/application/repositories/notification-log-repository'
import { AnamnesisTokenRequestedEvent } from '@/domain/enterprise/events/anamnesis-token-requested.event'
import { RequestAnamnesisTokenUseCase } from '@/domain/application/use-cases/anamnesis/request-anamnesis-token'
import { unwrapEither } from '@/shared/either/either'

const APP_URL = process.env['APP_URL'] ?? 'https://cliniker.com.br'

function buildAnamnesisEmail(patientName: string, link: string, expiresAt: Date): string {
  const expiry = expiresAt.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Sao_Paulo',
  })

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Preencha sua Anamnese</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">
          <tr>
            <td style="background:#7C3AED;border-radius:12px 12px 0 0;padding:36px 40px;text-align:center;">
              <div style="color:#fff;font-size:26px;font-weight:bold;letter-spacing:-0.5px;">Cliniker</div>
              <div style="color:#bfdbfe;font-size:13px;margin-top:4px;">Sistema de Gestao Clinica</div>
            </td>
          </tr>
          <tr>
            <td style="background:#fff;border-radius:0 0 12px 12px;padding:36px 40px;box-shadow:0 4px 16px rgba(0,0,0,0.06);">
              <h2 style="margin:0 0 8px;color:#0f172a;font-size:22px;">Ola, ${patientName}!</h2>
              <p style="margin:0 0 24px;color:#475569;font-size:15px;line-height:1.6;">
                Por favor, preencha sua <strong>anamnese</strong> clicando no botao abaixo. Nao e necessario criar conta ou fazer login.
              </p>
              <p style="margin:0 0 16px;color:#64748b;font-size:13px;">
                Este link expira em <strong>${expiry}</strong>.
              </p>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding-bottom:28px;">
                    <a href="${link}" style="display:inline-block;background:#7C3AED;color:#fff;font-size:15px;font-weight:bold;text-decoration:none;padding:14px 40px;border-radius:8px;">
                      Preencher Anamnese
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin:0;font-size:13px;color:#94a3b8;text-align:center;">
                Se voce nao esperava este email, pode ignora-lo com seguranca.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

@Injectable()
export class OnAnamnesisTokenRequested {
  private readonly logger = new Logger(OnAnamnesisTokenRequested.name)

  constructor(
    @Inject(RequestAnamnesisTokenUseCase)
    private readonly requestAnamnesisTokenUseCase: RequestAnamnesisTokenUseCase,
    @Inject(EmailQueue)
    private readonly emailQueue: EmailQueue,
    @Inject(WhatsAppQueue)
    private readonly whatsAppQueue: WhatsAppQueue,
    @Inject(NotificationLogRepository)
    private readonly notificationLogRepository: NotificationLogRepository,
  ) {}

  @OnEvent('anamnesis.token.requested')
  async handle(event: AnamnesisTokenRequestedEvent) {
    this.logger.log(`Handler OnAnamnesisTokenRequested: patientId=${event.patientId}`)

    try {
      const result = await this.requestAnamnesisTokenUseCase.execute({
        patientId: event.patientId,
        clinicId: event.clinicId,
      })

      const { token } = unwrapEither(result)
      const link = `${APP_URL}/anamnese/${token.token}`

      const log = await this.notificationLogRepository.create({
        clinicId: event.clinicId,
        channel: 'EMAIL',
        type: 'ANAMNESIS_TOKEN_SENT',
        recipientRef: event.patientEmail,
        patientId: event.patientId,
      })

      await this.emailQueue.enqueue({
        to: event.patientEmail,
        subject: 'Preencha sua anamnese - Cliniker',
        html: buildAnamnesisEmail(event.patientName, link, token.expiresAt),
        text: `Ola, ${event.patientName}!\n\nPreencha sua anamnese acessando o link abaixo:\n${link}\n\nEste link expira em 7 dias.`,
        logId: log.id,
      })

      this.logger.log(`Email de anamnese enfileirado: patientId=${event.patientId}`)

      if (event.patientPhone) {
        await this.whatsAppQueue.enqueue({
          to: event.patientPhone,
          message: `Ola, ${event.patientName}! Para preencher sua anamnese, acesse o link abaixo (valido por 7 dias):\n${link}`,
        })

        this.logger.log(`WhatsApp de anamnese enfileirado: patientId=${event.patientId}`)
      }
    } catch (error) {
      this.logger.error(`Erro ao processar token de anamnese: patientId=${event.patientId}`, error)
      throw error
    }
  }
}
