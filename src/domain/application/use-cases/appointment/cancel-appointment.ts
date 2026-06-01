import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { type Either, makeLeft, makeRight } from '@/shared/either/either';
import { AppointmentNotFoundError } from '@/shared/errors/appointment-not-found-error';
import { AppointmentNotWaitingError } from '@/shared/errors/appointment-not-waiting-error';
import type { Appointment } from '@/domain/enterprise/entities/appointment';
import { AppointmentsRepository } from '../../repositories/appointments-repository';
import { PatientRepository } from '../../repositories/patient-repository';
import { UsersRepository } from '../../repositories/users-repository';
import { ProfessionalRepository } from '../../repositories/professional-repository';
import { FranchiseRepository } from '../../repositories/franchise-repository';
import { AppointmentCancelledEvent } from '@/domain/enterprise/events/appointment-cancelled.event';

interface CancelAppointmentUseCaseRequest {
  appointmentId: string;
}

type CancelAppointmentUseCaseResponse = Either<
  AppointmentNotFoundError | AppointmentNotWaitingError,
  {
    appointment: Appointment;
  }
>;

@Injectable()
export class CancelAppointmentUseCase {
  constructor(
    @Inject(AppointmentsRepository)
    private appointmentsRepository: AppointmentsRepository,
    @Inject(PatientRepository)
    private patientRepository: PatientRepository,
    @Inject(UsersRepository)
    private usersRepository: UsersRepository,
    @Inject(ProfessionalRepository)
    private professionalRepository: ProfessionalRepository,
    @Inject(FranchiseRepository)
    private franchiseRepository: FranchiseRepository,
    @Inject(EventEmitter2)
    private eventEmitter: EventEmitter2,
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

    const patient = await this.patientRepository.findById(appointment.patientId.toString());
    const user = patient ? await this.usersRepository.findById(patient.userId.toString()) : null;

    const [professional, franchise] = await Promise.all([
      this.professionalRepository.findById(appointment.professionalId.toString()),
      this.franchiseRepository.findById(appointment.franchiseId.toString()),
    ]);
    const professionalUser = professional
      ? await this.usersRepository.findById(professional.userId.toString())
      : null;

    if (patient && user) {
      this.eventEmitter.emit(
        'appointment.cancelled',
        new AppointmentCancelledEvent(
          appointment.id.toString(),
          patient.name,
          user.email.getValue(),
          appointment.name,
          appointment.startAt,
          user.phone,
          professionalUser?.name,
          franchise?.address,
        ),
      );
    }

    return makeRight({ appointment });
  }
}
