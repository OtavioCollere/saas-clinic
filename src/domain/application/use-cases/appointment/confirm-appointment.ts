import { type Either, makeLeft, makeRight } from '@/shared/either/either';
import { AppointmentNotFoundError } from '@/shared/errors/appointment-not-found-error';
import { PatientNotFoundError } from '@/shared/errors/patient-not-found-error';
import { AppointmentNotWaitingError } from '@/shared/errors/appointment-not-waiting-error';
import type { Appointment } from '@/domain/enterprise/entities/appointment';
import type { AppointmentsRepository } from '../../repositories/appointments-repository';
import type { PatientRepository } from '../../repositories/patient-repository';

interface ConfirmAppointmentUseCaseRequest {
  appointmentId: string;
  patientId: string;
}

type ConfirmAppointmentUseCaseResponse = Either<
  AppointmentNotFoundError | PatientNotFoundError | AppointmentNotWaitingError,
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

    if (!appointment.status.isWaiting()) {
      return makeLeft(new AppointmentNotWaitingError());
    }

    appointment.status = appointment.status.confirm();
    appointment.updatedAt = new Date();

    await this.appointmentsRepository.update(appointment);

    return makeRight({ appointment });
  }
}
