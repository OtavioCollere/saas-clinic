import { Inject, Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EmailQueue } from '@/shared/services/email/email-queue';
import { WhatsAppQueue } from '@/shared/services/whatsapp/whatsapp-queue';
import { ClinicRepository } from '@/domain/application/repositories/clinic-repository';
import { NotificationLogRepository } from '@/domain/application/repositories/notification-log-repository';
import { AppointmentCancelledEvent } from '@/domain/enterprise/events/appointment-cancelled.event';

const APP_URL = process.env['APP_URL'] ?? 'https://cliniker.com.br';

function buildCancelledEmail(patientName: string, appointmentName: string, date: string, time: string): string {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Consulta Cancelada</title>
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
              <h2 style="margin:0 0 8px;color:#0f172a;font-size:22px;">Consulta cancelada</h2>
              <p style="margin:0 0 24px;color:#475569;font-size:15px;line-height:1.6;">
                Ola, <strong>${patientName}</strong>. Informamos que sua consulta foi cancelada.
              </p>
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;margin-bottom:24px;">
                <tr>
                  <td style="padding:16px 20px;border-bottom:1px solid #e2e8f0;">
                    <div style="font-size:11px;font-weight:bold;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">Consulta</div>
                    <div style="font-size:15px;color:#1e293b;font-weight:600;">${appointmentName}</div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:16px 20px;border-bottom:1px solid #e2e8f0;">
                    <div style="font-size:11px;font-weight:bold;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">Data</div>
                    <div style="font-size:15px;color:#1e293b;font-weight:600;">${date}</div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:16px 20px;">
                    <div style="font-size:11px;font-weight:bold;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">Horario</div>
                    <div style="font-size:15px;color:#1e293b;font-weight:600;">${time}</div>
                  </td>
                </tr>
              </table>
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#fef2f2;border:1px solid #fca5a5;border-radius:10px;margin-bottom:28px;">
                <tr>
                  <td style="padding:14px 20px;">
                    <div style="font-size:13px;color:#991b1b;line-height:1.5;">
                      Cancelamento confirmado. Se desejar reagendar, entre em contato conosco.
                    </div>
                  </td>
                </tr>
              </table>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding-bottom:28px;">
                    <a href="${APP_URL}" style="display:inline-block;background:#7C3AED;color:#fff;font-size:15px;font-weight:bold;text-decoration:none;padding:14px 40px;border-radius:8px;">
                      Reagendar consulta
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin:0;font-size:13px;color:#94a3b8;text-align:center;">
                Se voce nao esperava este email, pode ignora-lo com seguranca.
              </p>
            </td>
          </tr>
          <tr>
            <td style="text-align:center;padding:20px 0 4px;">
              <p style="margin:0;font-size:12px;color:#94a3b8;">© ${new Date().getFullYear()} Cliniker · Sistema de Gestao Clinica</p>
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
export class OnAppointmentCancelled {
  private readonly logger = new Logger(OnAppointmentCancelled.name)

  constructor(
    @Inject(EmailQueue)
    private readonly emailQueue: EmailQueue,
    @Inject(WhatsAppQueue)
    private readonly whatsAppQueue: WhatsAppQueue,
    @Inject(ClinicRepository)
    private readonly clinicRepository: ClinicRepository,
    @Inject(NotificationLogRepository)
    private readonly notificationLogRepository: NotificationLogRepository,
  ) {}

  @OnEvent('appointment.cancelled')
  async handle(event: AppointmentCancelledEvent) {
    const date = event.startAt.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
    const time = event.startAt.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const clinic = await this.clinicRepository.findById(event.clinicId)
    const credentials =
      clinic?.zapInstanceId && clinic?.zapToken
        ? { instanceId: clinic.zapInstanceId, token: clinic.zapToken, clientToken: clinic.zapClientToken }
        : undefined

    const log = await this.notificationLogRepository.create({
      clinicId: event.clinicId,
      channel: event.patientPhone ? 'WHATSAPP' : 'EMAIL',
      type: 'APPOINTMENT_CANCELLED',
      recipientRef: event.patientPhone ?? event.patientEmail,
      appointmentId: event.appointmentId,
    })

    if (event.patientPhone) {
      const lines = [
        `Ola, *${event.patientName}*.`,
        '',
        'Informamos que sua consulta foi *cancelada*.',
        '',
        `*${event.appointmentName}*`,
        `Data: ${date}`,
        `Horario: ${time}`,
      ];
      if (event.professionalName) lines.push(`Profissional: ${event.professionalName}`);
      if (event.address) lines.push(`Local: ${event.address}`);
      lines.push('', 'Para reagendar, entre em contato conosco.', '', '_Cliniker - Sistema de Gestao Clinica_');

      await this.whatsAppQueue.enqueue({
        to: event.patientPhone,
        message: lines.join('\n'),
        credentials,
        logId: log.id,
      });
      this.logger.log(`WhatsApp de cancelamento enfileirado para ${event.patientPhone}`);
      return;
    }

    await this.emailQueue.enqueue({
      to: event.patientEmail,
      subject: 'Sua consulta foi cancelada - Cliniker',
      html: buildCancelledEmail(event.patientName, event.appointmentName, date, time),
      text: `Ola, ${event.patientName}. Sua consulta "${event.appointmentName}" marcada para ${date} as ${time} foi cancelada. Entre em contato para reagendar.`,
      logId: log.id,
    });
  }
}
