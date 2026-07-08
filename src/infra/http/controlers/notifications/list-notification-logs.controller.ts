import { Controller, Get, Param, Query, UseGuards, Inject } from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { NotificationLogRepository } from '@/domain/application/repositories/notification-log-repository'

@Controller('clinics/:clinicId/notifications/logs')
@UseGuards(JwtAuthGuard)
export class ListNotificationLogsController {
  constructor(
    @Inject(NotificationLogRepository)
    private readonly notificationLogRepository: NotificationLogRepository,
  ) {}

  @Get()
  async handle(
    @Param('clinicId') clinicId: string,
    @Query('channel') channel?: string,
    @Query('status') status?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const parsedPage = page ? parseInt(page, 10) : 1
    const parsedLimit = limit ? parseInt(limit, 10) : 20

    const result = await this.notificationLogRepository.findByClinicId({
      clinicId,
      channel,
      status,
      page: parsedPage,
      limit: parsedLimit,
    })

    return {
      success: true,
      data: result.logs,
      meta: {
        total: result.total,
        page: parsedPage,
        limit: parsedLimit,
      },
    }
  }
}
