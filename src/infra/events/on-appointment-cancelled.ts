import { Inject, Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EmailQueue } from '@/shared/services/email/email-queue';
import { WhatsAppSender } from '@/shared/services/whatsapp/whatsapp-sender';
import { AppointmentCancelledEvent } from '@/domain/enterprise/events/appointment-cancelled.event';

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

          <!-- Header -->
          <tr>
            <td style="background:#7C3AED;border-radius:12px 12px 0 0;padding:36px 40px;text-align:center;">
              <div style="display:inline-block;background:rgba(255,255,255,0.15);border-radius:50%;width:52px;height:52px;line-height:52px;font-size:24px;font-weight:bold;color:#fff;margin-bottom:12px;">+</div>
              <div style="color:#fff;font-size:26px;font-weight:bold;letter-spacing:-0.5px;">Cliniker</div>
              <div style="color:#bfdbfe;font-size:13px;margin-top:4px;">Sistema de GestÃ£o ClÃ­nica</div>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background:#fff;border-radius:0 0 12px 12px;padding:36px 40px;box-shadow:0 4px 16px rgba(0,0,0,0.06);">

              <h2 style="margin:0 0 8px;color:#0f172a;font-size:22px;">Consulta cancelada</h2>
              <p style="margin:0 0 24px;color:#475569;font-size:15px;line-height:1.6;">
                OlÃ¡, <strong>${patientName}</strong>. Informamos que sua consulta foi cancelada.
              </p>

              <!-- Appointment details -->
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
                    <div style="font-size:11px;font-weight:bold;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">HorÃ¡rio</div>
                    <div style="font-size:15px;color:#1e293b;font-weight:600;">${time}</div>
                  </td>
                </tr>
              </table>

              <!-- Warning box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#fef2f2;border:1px solid #fca5a5;border-radius:10px;margin-bottom:28px;">
                <tr>
                  <td style="padding:14px 20px;">
                    <div style="font-size:13px;color:#991b1b;line-height:1.5;">
                      âŒ <strong>Cancelamento confirmado.</strong> Se desejar reagendar, entre em contato conosco.
                    </div>
                  </td>
                </tr>
              </table>

              <!-- CTA -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding-bottom:28px;">
                    <a href="https://cliniker.com.br"
                       style="display:inline-block;background:#7C3AED;color:#fff;font-size:15px;font-weight:bold;text-decoration:none;padding:14px 40px;border-radius:8px;letter-spacing:0.2px;">
                      Reagendar consulta
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0;font-size:13px;color:#94a3b8;text-align:center;line-height:1.5;">
                Se vocÃª nÃ£o esperava este email, pode ignorÃ¡-lo com seguranÃ§a.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="text-align:center;padding:20px 0 4px;">
              <p style="margin:0;font-size:12px;color:#94a3b8;">Â© ${new Date().getFullYear()} Cliniker Â· Sistema de GestÃ£o ClÃ­nica</p>
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
    @Inject(WhatsAppSender)
    private readonly whatsAppSender: WhatsAppSender,
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

    if (event.patientPhone) {
      try {
        const lines = [
          `Ola, *${event.patientName}*.`,
          '',
          'Informamos que sua consulta foi *cancelada*.',
          '',
          `ðŸ“‹ *${event.appointmentName}*`,
          `ðŸ—“ ${date}`,
          `ðŸ• ${time}`,
        ];
        if (event.professionalName) lines.push(`ðŸ‘¨â€âš•ï¸ ${event.professionalName}`);
        if (event.address) lines.push(`ðŸ“ ${event.address}`);
        lines.push('', 'Para reagendar, entre em contato conosco.', '', '_Cliniker - Sistema de Gestao Clinica_');

        await this.whatsAppSender.send({
          to: event.patientPhone,
          message: lines.join('\n'),
        })
        this.logger.log(`WhatsApp de cancelamento enviado para ${event.patientPhone}`)
        return
      } catch (err) {
        this.logger.warn(`Falha no WhatsApp, tentando email â€” ${err}`)
      }
    }

    await this.emailQueue.enqueue({
      to: event.patientEmail,
      subject: 'Sua consulta foi cancelada â€” Cliniker',
      html: buildCancelledEmail(event.patientName, event.appointmentName, date, time),
      text: `Ola, ${event.patientName}. Sua consulta "${event.appointmentName}" marcada para ${date} as ${time} foi cancelada. Entre em contato para reagendar.`,
    });
  }
}

