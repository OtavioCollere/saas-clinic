import { type Either, makeLeft, makeRight } from '@/shared/either/either';
import { AppointmentNotFoundError } from '@/shared/errors/appointment-not-found-error';
import { AppointmentNotWaitingError } from '@/shared/errors/appointment-not-waiting-error';
import type { Appointment } from '@/domain/enterprise/entities/appointment';
import type { AppointmentsRepository } from '../../repositories/appointments-repository';

interface CancelAppointmentUseCaseRequest {
  appointmentId: string;
}

type CancelAppointmentUseCaseResponse = Either<
  AppointmentNotFoundError | AppointmentNotWaitingError,
  {
    appointment: Appointment;
  }
>;

export class CancelAppointmentUseCase {
  constructor(
    private appointmentsRepository: AppointmentsRepository
  ) {}

  async execute({ appointmentId }: CancelAppointmentUseCaseRequest): Promise<CancelAppointmentUseCaseResponse> {
    const appointment = await this.appointmentsRepository.findById(appointmentId);

    if (!appointment) {
      return makeLeft(new AppointmentNotFoundError());
    }

    if (!appointment.status.isWaiting()) {
      return makeLeft(new AppointmentNotWaitingError());
    }

    appointment.status = appointment.status.cancel();
    appointment.updatedAt = new Date();

    await this.appointmentsRepository.update(appointment);

    return makeRight({ appointment });
  }
}
