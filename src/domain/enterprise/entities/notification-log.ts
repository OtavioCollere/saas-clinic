export type NotificationChannel = 'EMAIL' | 'WHATSAPP'
export type NotificationType =
  | 'APPOINTMENT_CREATED'
  | 'APPOINTMENT_CANCELLED'
  | 'APPOINTMENT_RESCHEDULED'
  | 'APPOINTMENT_REMINDER'
  | 'PATIENT_WELCOME'
  | 'PROFESSIONAL_WELCOME'
  | 'STAFF_WELCOME'
  | 'OWNER_WELCOME'
  | 'ANAMNESIS_TOKEN_SENT'
export type NotificationStatus = 'QUEUED' | 'SENT' | 'FAILED'

export interface CreateNotificationLogProps {
  clinicId: string
  channel: NotificationChannel
  type: NotificationType
  recipientRef: string
  appointmentId?: string
  patientId?: string
  scheduledFor?: Date
}

export class NotificationLog {
  id!: string
  clinicId!: string
  channel!: NotificationChannel
  type!: NotificationType
  status!: NotificationStatus
  recipientRef!: string
  appointmentId?: string
  patientId?: string
  attempts!: number
  providerMessageId?: string
  errorMessage?: string
  scheduledFor?: Date
  queuedAt!: Date
  sentAt?: Date
  failedAt?: Date
  createdAt!: Date
  updatedAt!: Date
}
