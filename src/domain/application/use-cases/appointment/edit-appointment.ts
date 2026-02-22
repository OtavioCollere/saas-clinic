import { Inject, Injectable } from '@nestjs/common';
import { type Either, makeLeft, makeRight } from '@/shared/either/either';
import { UniqueEntityId } from '@/shared/entities/unique-entity-id';
import { AppointmentItem } from '@/domain/enterprise/entities/appointment-item';
import { ProfessionalRepository } from '../../repositories/professional-repository';
import { FranchiseRepository } from '../../repositories/franchise-repository';
import { PatientRepository } from '../../repositories/patient-repository';
import { ProfessionalNotFoundError } from '@/shared/errors/professional-not-found-error';
import { FranchiseNotFoundError } from '@/shared/errors/franchise-not-found-error';
import { PatientNotFoundError } from '@/shared/errors/patient-not-found-error';
import { AppointmentNotFoundError } from '@/shared/errors/appointment-not-found-error';
import { AppointmentConflictError } from '@/shared/errors/appointment-conflict-error';
import { AppointmentsRepository } from '../../repositories/appointments-repository';
import { Appointment } from '@/domain/enterprise/entities/appointment';
import { AppointmentStatus } from '@/domain/enterprise/value-objects/appointment-status';

interface EditAppointmentUseCaseRequest {
  appointmentId: string;
  professionalId: string;
  franchiseId: string;
  patientId: string;
  name: string;
  appointmentItems: AppointmentItem[];
  startAt: Date;
  durationInMinutes: number;
}

type EditAppointmentUseCaseResponse = Either<
  AppointmentNotFoundError | ProfessionalNotFoundError | FranchiseNotFoundError | PatientNotFoundError | AppointmentConflictError,
  {
    appointment: Appointment;
  }
>;

@Injectable()
export class EditAppointmentUseCase {
  constructor(
    @Inject(ProfessionalRepository)
    private professionalRepository: ProfessionalRepository,
    @Inject(FranchiseRepository)
    private franchiseRepository: FranchiseRepository,
    @Inject(PatientRepository)
    private patientRepository: PatientRepository,
    @Inject(AppointmentsRepository)
    private appointmentsRepository: AppointmentsRepository
  ) {}

  async execute({ appointmentId, professionalId, franchiseId, patientId, name, appointmentItems, startAt, durationInMinutes }: EditAppointmentUseCaseRequest) {
   
    const appointment = await this.appointmentsRepository.findById(appointmentId);

    if (!appointment) {
      return makeLeft(new AppointmentNotFoundError());
    }

    const professional = await this.professionalRepository.findById(professionalId);

    if (!professional) {
      return makeLeft(new ProfessionalNotFoundError());
    }

    const franchise = await this.franchiseRepository.findById(franchiseId);

    if (!franchise) {
      return makeLeft(new FranchiseNotFoundError());
    }

    const patient = await this.patientRepository.findById(patientId);

    if (!patient) {
      return makeLeft(new PatientNotFoundError());
    }

    const endAt = new Date(startAt.getTime() + durationInMinutes * 60000);

    const appointmentConflict = await this.appointmentsRepository.findByProfessionalIdAndHourRangeExcludingId(professionalId, startAt, endAt, appointmentId);

    if(appointmentConflict) {
      return makeLeft(new AppointmentConflictError(appointmentConflict.startAt));
    }
    
    appointment.professionalId = new UniqueEntityId(professionalId);
    appointment.franchiseId = new UniqueEntityId(franchiseId);
    appointment.patientId = new UniqueEntityId(patientId);
    appointment.name = name;
    appointment.appointmentItems = appointmentItems;
    appointment.startAt = startAt;
    appointment.durationInMinutes = durationInMinutes;
    appointment.endAt = endAt;
    appointment.status = AppointmentStatus.waiting();

    await this.appointmentsRepository.update(appointment);

    return makeRight({
      appointment,
    });
  }
}
