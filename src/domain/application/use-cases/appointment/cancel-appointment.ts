import { type Either, makeLeft, makeRight } from '@/shared/either/either';
import { AppointmentNotFoundError } from '@/shared/errors/appointment-not-found-error';
import { DomainError } from '@/shared/errors/domain-error';
import type { Appointment } from '@/domain/enterprise/entities/appointment';
import { AppointmentStatus } from '@/domain/enterprise/value-objects/appointment-status';
import type { AppointmentsRepository } from '../../repositories/appointments-repository';

interface CancelAppointmentUseCaseRequest {
  appointmentId: string;
}

type CancelAppointmentUseCaseResponse = Either<
  AppointmentNotFoundError | DomainError,
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
      return makeLeft(new DomainError('Only waiting appointments can be canceled'));
    }

    try {
      appointment.status = appointment.status.cancel();
      appointment.updatedAt = new Date();

      await this.appointmentsRepository.update(appointment);

      return makeRight({ appointment });
    } catch (error) {
      if (error instanceof DomainError) {
        return makeLeft(error);
      }
      throw error;
    }
  }
}
