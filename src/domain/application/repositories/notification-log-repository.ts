import { CreateNotificationLogProps, NotificationLog } from '@/domain/enterprise/entities/notification-log'

export interface NotificationLogFilters {
  clinicId: string
  channel?: string
  status?: string
  page?: number
  limit?: number
}

export abstract class NotificationLogRepository {
  abstract create(props: CreateNotificationLogProps): Promise<NotificationLog>
  abstract markSent(id: string, providerMessageId?: string): Promise<void>
  abstract markFailed(id: string, errorMessage: string): Promise<void>
  abstract incrementAttempts(id: string): Promise<void>
  abstract findByClinicId(filters: NotificationLogFilters): Promise<{ logs: NotificationLog[]; total: number }>
}
