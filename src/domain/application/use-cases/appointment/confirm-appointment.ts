import { type Either, makeLeft, makeRight } from '@/core/either/either';
import { AppointmentNotFoundError } from '@/core/errors/appointment-not-found-error';
import { PatientNotFoundError } from '@/core/errors/patient-not-found-error';
import { DomainError } from '@/core/errors/domain-error';
import type { Appointment } from '@/domain/enterprise/entities/appointment';
import type { AppointmentsRepository } from '../../repositories/appointments-repository';
import type { PatientRepository } from '../../repositories/patient-repository';

interface ConfirmAppointmentUseCaseRequest {
  appointmentId: string;
  patientId: string;
}

type ConfirmAppointmentUseCaseResponse = Either<
  AppointmentNotFoundError | PatientNotFoundError | DomainError,
  {
    appointment: Appointment;
  }
>;

export class ConfirmAppointmentUseCase {
  constructor(
    private appointmentsRepository: AppointmentsRepository,
    private patientRepository: PatientRepository
  ) {}

  async execute({ appointmentId, patientId }: ConfirmAppointmentUseCaseRequest): Promise<ConfirmAppointmentUseCaseResponse> {
    const patient = await this.patientRepository.findById(patientId);

    if (!patient) {
      return makeLeft(new PatientNotFoundError());
    }

    const appointment = await this.appointmentsRepository.findById(appointmentId);

    if (!appointment) {
      return makeLeft(new AppointmentNotFoundError());
    }

    try {
      appointment.status = appointment.status.confirm();
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
