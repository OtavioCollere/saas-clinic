import { type Either, makeLeft, makeRight } from '@/shared/either/either';
import { AppointmentNotFoundError } from '@/shared/errors/appointment-not-found-error';
import { PatientNotFoundError } from '@/shared/errors/patient-not-found-error';
import { AppointmentNotWaitingError } from '@/shared/errors/appointment-not-waiting-error';
import type { Appointment } from '@/domain/enterprise/entities/appointment';
import { AppointmentsRepository } from '../../repositories/appointments-repository';
import { PatientRepository } from '../../repositories/patient-repository';
import { Inject, Injectable } from '@nestjs/common';

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

@Injectable()
export class ConfirmAppointmentUseCase {
  constructor(
    @Inject(AppointmentsRepository)
    private appointmentsRepository: AppointmentsRepository,
    @Inject(PatientRepository)
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
      if (appointment.status.isConfirmed()) {
        return makeRight({ appointment });
      }
      return makeLeft(new AppointmentNotWaitingError());
    }

    appointment.status = appointment.status.confirm();
    appointment.updatedAt = new Date();

    await this.appointmentsRepository.update(appointment);

    return makeRight({ appointment });
  }
}
