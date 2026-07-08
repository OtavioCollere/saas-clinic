import { Inject, Injectable, Logger } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'
import { AppointmentsRepository } from '@/domain/application/repositories/appointments-repository'
import { PatientRepository } from '@/domain/application/repositories/patient-repository'
import { UsersRepository } from '@/domain/application/repositories/users-repository'
import { ProfessionalRepository } from '@/domain/application/repositories/professional-repository'
import { FranchiseRepository } from '@/domain/application/repositories/franchise-repository'
import { ClinicRepository } from '@/domain/application/repositories/clinic-repository'
import { NotificationLogRepository } from '@/domain/application/repositories/notification-log-repository'
import { EmailQueue } from '@/shared/services/email/email-queue'
import { WhatsAppQueue } from '@/shared/services/whatsapp/whatsapp-queue'

const APP_URL = process.env["APP_URL"] ?? 'https://cliniker.com.br';

function buildReminderEmail(patientName: string, appointmentName: string, date: string, time: string): string {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Lembrete de Consulta</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">

          <!-- Header -->
          <tr>
            <td style="background:#1D4ED8;border-radius:12px 12px 0 0;padding:36px 40px;text-align:center;">
              <div style="display:inline-block;background:rgba(255,255,255,0.15);border-radius:50%;width:52px;height:52px;line-height:52px;font-size:24px;font-weight:bold;color:#fff;margin-bottom:12px;">+</div>
              <div style="color:#fff;font-size:26px;font-weight:bold;letter-spacing:-0.5px;">Cliniker</div>
              <div style="color:#bfdbfe;font-size:13px;margin-top:4px;">Sistema de Gestão Clínica</div>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background:#fff;border-radius:0 0 12px 12px;padding:36px 40px;box-shadow:0 4px 16px rgba(0,0,0,0.06);">

              <h2 style="margin:0 0 8px;color:#0f172a;font-size:22px;">Lembrete de consulta 📅</h2>
              <p style="margin:0 0 24px;color:#475569;font-size:15px;line-height:1.6;">
                Olá, <strong>${patientName}</strong>! Você tem uma consulta marcada para <strong>amanhã</strong>. Não esqueça!
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
                    <div style="font-size:11px;font-weight:bold;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">Horário</div>
                    <div style="font-size:15px;color:#1e293b;font-weight:600;">${time}</div>
                  </td>
                </tr>
              </table>

              <!-- Info box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:10px;margin-bottom:28px;">
                <tr>
                  <td style="padding:14px 20px;">
                    <div style="font-size:13px;color:#1e40af;line-height:1.5;">
                      ℹ️ Em caso de imprevisto, entre em contato para cancelar ou reagendar com antecedência.
                    </div>
                  </td>
                </tr>
              </table>

              <!-- CTA -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding-bottom:28px;">
                    <a href="${APP_URL}"
                       style="display:inline-block;background:#1D4ED8;color:#fff;font-size:15px;font-weight:bold;text-decoration:none;padding:14px 40px;border-radius:8px;letter-spacing:0.2px;">
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
export class AppointmentReminderScheduler {
  private readonly logger = new Logger(AppointmentReminderScheduler.name)

  constructor(
    @Inject(AppointmentsRepository)
    private readonly appointmentsRepository: AppointmentsRepository,
    @Inject(PatientRepository)
    private readonly patientRepository: PatientRepository,
    @Inject(UsersRepository)
    private readonly usersRepository: UsersRepository,
    @Inject(ProfessionalRepository)
    private readonly professionalRepository: ProfessionalRepository,
    @Inject(FranchiseRepository)
    private readonly franchiseRepository: FranchiseRepository,
    @Inject(ClinicRepository)
    private readonly clinicRepository: ClinicRepository,
    @Inject(NotificationLogRepository)
    private readonly notificationLogRepository: NotificationLogRepository,
    @Inject(EmailQueue)
    private readonly emailQueue: EmailQueue,
    @Inject(WhatsAppQueue)
    private readonly whatsAppQueue: WhatsAppQueue,
  ) {}

  @Cron('0 8 * * *', { timeZone: 'America/Sao_Paulo' })
  async sendDayBeforeReminders() {
    if (process.env.ENABLE_CRON !== 'true') return;
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)

    this.logger.log(`Buscando consultas para ${tomorrow.toLocaleDateString('pt-BR')}`)

    const appointments = await this.appointmentsRepository.findActiveForDate(tomorrow)

    this.logger.log(`${appointments.length} consulta(s) encontrada(s) para amanhã`)

    for (const appointment of appointments) {
      try {
        const patient = await this.patientRepository.findById(appointment.patientId.toString())
        if (!patient) continue

        const user = await this.usersRepository.findById(patient.userId.toString())
        if (!user) continue

        const [professional, franchise] = await Promise.all([
          this.professionalRepository.findById(appointment.professionalId.toString()),
          this.franchiseRepository.findById(appointment.franchiseId.toString()),
        ])

        const clinic = franchise
          ? await this.clinicRepository.findById(franchise.clinicId.toString())
          : null
        const credentials =
          clinic?.zapInstanceId && clinic?.zapToken
            ? { instanceId: clinic.zapInstanceId, token: clinic.zapToken, clientToken: clinic.zapClientToken }
            : undefined
        const professionalUser = professional
          ? await this.usersRepository.findById(professional.userId.toString())
          : null

        const date = appointment.startAt.toLocaleDateString('pt-BR', {
          weekday: 'long',
          day: '2-digit',
          month: 'long',
        })
        const time = appointment.startAt.toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
        })

        const channel = user.phone ? 'WHATSAPP' : 'EMAIL'
        const recipientRef = user.phone ?? user.email.getValue()

        const log = await this.notificationLogRepository.create({
          clinicId: franchise?.clinicId.toString() ?? '',
          channel,
          type: 'APPOINTMENT_REMINDER',
          recipientRef,
          appointmentId: appointment.id.toString(),
        })

        if (user.phone) {
          const reminderLines = [
            `Ola, *${patient.name}*!`,
            '',
            'Passando para lembrar que voce tem uma consulta marcada para *amanha*.',
            '',
            `*${appointment.name}*`,
            `Data: ${date}`,
            `Horario: ${time}`,
          ]
          if (professionalUser) reminderLines.push(`Profissional: ${professionalUser.name}`)
          if (franchise?.address) reminderLines.push(`Local: ${franchise.address}`)
          reminderLines.push('', 'Qualquer imprevisto, entre em contato com antecedencia.', '', '_Cliniker - Sistema de Gestao Clinica_')

          await this.whatsAppQueue.enqueue({
            to: user.phone,
            message: reminderLines.join('\n'),
            credentials,
            logId: log.id,
          })
          this.logger.log(`WhatsApp lembrete enfileirado para ${user.phone} (consulta ${appointment.id})`)
          continue
        }

        await this.emailQueue.enqueue({
          to: user.email.getValue(),
          subject: 'Lembrete: voce tem uma consulta amanha - Cliniker',
          html: buildReminderEmail(patient.name, appointment.name, date, time),
          text: `Ola, ${patient.name}! Lembrete: voce tem uma consulta "${appointment.name}" amanha, ${date} as ${time}.`,
          logId: log.id,
        })

        this.logger.log(`Email lembrete enfileirado para ${user.email.getValue()} (consulta ${appointment.id})`)
      } catch (error) {
        this.logger.error(`Erro ao enviar lembrete para consulta ${appointment.id}`, error)
      }
    }
  }
}
