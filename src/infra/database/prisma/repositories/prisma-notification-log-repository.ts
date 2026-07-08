import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma.service'
import {
  NotificationLogRepository,
  NotificationLogFilters,
} from '@/domain/application/repositories/notification-log-repository'
import {
  CreateNotificationLogProps,
  NotificationLog,
} from '@/domain/enterprise/entities/notification-log'

@Injectable()
export class PrismaNotificationLogRepository implements NotificationLogRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(props: CreateNotificationLogProps): Promise<NotificationLog> {
    const log = await this.prisma.notificationLog.create({
      data: {
        clinicId: props.clinicId,
        channel: props.channel,
        type: props.type,
        recipientRef: props.recipientRef,
        appointmentId: props.appointmentId ?? null,
        patientId: props.patientId ?? null,
        scheduledFor: props.scheduledFor ?? null,
        status: 'QUEUED',
      },
    })
    return log as NotificationLog
  }

  async markSent(id: string, providerMessageId?: string): Promise<void> {
    await this.prisma.notificationLog.update({
      where: { id },
      data: {
        status: 'SENT',
        sentAt: new Date(),
        providerMessageId: providerMessageId ?? null,
      },
    })
  }

  async markFailed(id: string, errorMessage: string): Promise<void> {
    await this.prisma.notificationLog.update({
      where: { id },
      data: { status: 'FAILED', failedAt: new Date(), errorMessage },
    })
  }

  async incrementAttempts(id: string): Promise<void> {
    await this.prisma.notificationLog.update({
      where: { id },
      data: { attempts: { increment: 1 } },
    })
  }

  async findByClinicId(
    filters: NotificationLogFilters,
  ): Promise<{ logs: NotificationLog[]; total: number }> {
    const page = filters.page ?? 1
    const limit = filters.limit ?? 20
    const skip = (page - 1) * limit

    const where = {
      clinicId: filters.clinicId,
      ...(filters.channel ? { channel: filters.channel } : {}),
      ...(filters.status ? { status: filters.status } : {}),
    }

    const [logs, total] = await Promise.all([
      this.prisma.notificationLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.notificationLog.count({ where }),
    ])

    return { logs: logs as NotificationLog[], total }
  }
}
