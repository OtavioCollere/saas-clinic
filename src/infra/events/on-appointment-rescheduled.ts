import { Inject, Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EmailQueue } from '@/shared/services/email/email-queue';
import { WhatsAppSender } from '@/shared/services/whatsapp/whatsapp-sender';
import { ClinicRepository } from '@/domain/application/repositories/clinic-repository';
import { AppointmentRescheduledEvent } from '@/domain/enterprise/events/appointment-rescheduled.event';

function buildRescheduledEmail(patientName: string, appointmentName: string, date: string, time: string, oldDate: string, oldTime: string): string {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Consulta Reagendada</title>
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
              <div style="color:#bfdbfe;font-size:13px;margin-top:4px;">Sistema de Gestão Clínica</div>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background:#fff;border-radius:0 0 12px 12px;padding:36px 40px;box-shadow:0 4px 16px rgba(0,0,0,0.06);">

              <h2 style="margin:0 0 8px;color:#0f172a;font-size:22px;">Consulta reagendada 📅</h2>
              <p style="margin:0 0 24px;color:#475569;font-size:15px;line-height:1.6;">
                Olá, <strong>${patientName}</strong>! Sua consulta foi reagendada para uma nova data.
              </p>

              <!-- New date -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;margin-bottom:16px;">
                <tr>
                  <td style="padding:16px 20px;border-bottom:1px solid #e2e8f0;">
                    <div style="font-size:11px;font-weight:bold;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">Consulta</div>
                    <div style="font-size:15px;color:#1e293b;font-weight:600;">${appointmentName}</div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:16px 20px;border-bottom:1px solid #e2e8f0;">
                    <div style="font-size:11px;font-weight:bold;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">Nova data</div>
                    <div style="font-size:15px;color:#1e293b;font-weight:600;">${date}</div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:16px 20px;">
                    <div style="font-size:11px;font-weight:bold;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">Novo horário</div>
                    <div style="font-size:15px;color:#1e293b;font-weight:600;">${time}</div>
                  </td>
                </tr>
              </table>

              <!-- Old date -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#fef9f0;border:1px solid #fde68a;border-radius:10px;margin-bottom:28px;">
                <tr>
                  <td style="padding:14px 20px;">
                    <div style="font-size:13px;color:#92400e;line-height:1.5;">
                      Consulta anterior: <strong>${oldDate}</strong> às <strong>${oldTime}</strong>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- CTA -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding-bottom:28px;">
                    <a href="${APP_URL}"
                       style="display:inline-block;background:#7C3AED;color:#fff;font-size:15px;font-weight:bold;text-decoration:none;padding:14px 40px;border-radius:8px;letter-spacing:0.2px;">
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

          <!-- Footer -->
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
export class OnAppointmentRescheduled {
  private readonly logger = new Logger(OnAppointmentRescheduled.name)

  constructor(
    @Inject(EmailQueue)
    private readonly emailQueue: EmailQueue,
    @Inject(WhatsAppSender)
    private readonly whatsAppSender: WhatsAppSender,
    @Inject(ClinicRepository)
    private readonly clinicRepository: ClinicRepository,
  ) {}

  @OnEvent('appointment.rescheduled')
  async handle(event: AppointmentRescheduledEvent) {
    const newDate = event.newStartAt.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
    const newTime = event.newStartAt.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
    const oldDate = event.oldStartAt.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
    const oldTime = event.oldStartAt.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const clinic = await this.clinicRepository.findById(event.clinicId)
    const credentials =
      clinic?.zapInstanceId && clinic?.zapToken
        ? { instanceId: clinic.zapInstanceId, token: clinic.zapToken, clientToken: clinic.zapClientToken }
        : undefined

    if (event.patientPhone) {
      try {
        const lines = [
          `Olá, *${event.patientName}*! 👋`,
          '',
          'Sua consulta foi *reagendada*. 📅',
          '',
          `📋 *${event.appointmentName}*`,
          `🗓 Nova data: ${newDate}`,
          `🕐 Novo horário: ${newTime}`,
        ];
        if (event.professionalName) lines.push(`👨‍⚕️ ${event.professionalName}`);
        if (event.address) lines.push(`📍 ${event.address}`);
        lines.push('', `_Consulta anterior: ${oldDate} às ${oldTime}_`, '', '_Cliniker — Sistema de Gestão Clínica_');

        await this.whatsAppSender.send({
          to: event.patientPhone,
          message: lines.join('\n'),
          credentials,
        });
        this.logger.log(`WhatsApp de reagendamento enviado para ${event.patientPhone}`);
        return;
      } catch (err) {
        this.logger.warn(`Falha no WhatsApp, tentando email — ${err}`);
      }
    }

    await this.emailQueue.enqueue({
      to: event.patientEmail,
      subject: 'Sua consulta foi reagendada — Cliniker',
      html: buildRescheduledEmail(event.patientName, event.appointmentName, newDate, newTime, oldDate, oldTime),
      text: `Olá, ${event.patientName}! Sua consulta "${event.appointmentName}" foi reagendada para ${newDate} às ${newTime}. Consulta anterior: ${oldDate} às ${oldTime}.`,
    });
  }
}
