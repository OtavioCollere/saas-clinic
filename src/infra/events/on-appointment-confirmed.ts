import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { isLeft, unwrapEither } from '@/shared/either/either';
import { AppointmentConfirmedEvent } from '@/domain/enterprise/events/appointment-confirmed.event';
import { CreateServiceOrderUseCase } from '@/domain/application/use-cases/service-order/create-service-order';
import type { ServiceOrder } from '@/domain/enterprise/entities/service-order';

@Injectable()
export class OnAppointmentConfirmed {
  constructor(
    @Inject(CreateServiceOrderUseCase)
    private readonly createServiceOrderUseCase: CreateServiceOrderUseCase,
  ) {}

  @OnEvent('appointment.confirmed')
  async handle(event: AppointmentConfirmedEvent): Promise<ServiceOrder> {
    const result = await this.createServiceOrderUseCase.execute({
      items: event.items,
      status: event.status,
      paymentMethod: event.paymentMethod,
    });

    if (isLeft(result)) {
      throw new Error(unwrapEither(result).message);
    }

    return unwrapEither(result).serviceOrder;
  }
}
