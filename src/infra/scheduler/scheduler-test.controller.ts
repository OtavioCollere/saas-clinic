import { Controller, Inject, Post } from '@nestjs/common'
import { Public } from '@/infra/auth/public'
import { AppointmentReminderScheduler } from './appointment-reminder.scheduler'

@Controller('/internal')
export class SchedulerTestController {
  constructor(
    @Inject(AppointmentReminderScheduler)
    private readonly scheduler: AppointmentReminderScheduler,
  ) {}

  @Post('/trigger-reminders')
  @Public()
  async triggerReminders() {
    await this.scheduler.sendDayBeforeReminders()
    return { ok: true }
  }
}
