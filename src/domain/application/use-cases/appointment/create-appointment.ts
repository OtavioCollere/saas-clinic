import { type Either, makeLeft, makeRight } from '@/shared/either/either';
import { UniqueEntityId } from '@/shared/entities/unique-entity-id';
import { AppointmentItem } from '@/domain/enterprise/entities/appointment-item';
import { ProfessionalRepository } from '../../repositories/professional-repository';
import { FranchiseRepository } from '../../repositories/franchise-repository';
import { PatientRepository } from '../../repositories/patient-repository';
import { ProfessionalNotFoundError } from '@/shared/errors/professional-not-found-error';
import { FranchiseNotFoundError } from '@/shared/errors/franchise-not-found-error';
import { PatientNotFoundError } from '@/shared/errors/patient-not-found-error';
import { AppointmentConflictError } from '@/shared/errors/appointment-conflict-error';
import { AppointmentsRepository } from '../../repositories/appointments-repository';
import { Appointment } from '@/domain/enterprise/entities/appointment';
import { AppointmentStatus } from '@/domain/enterprise/value-objects/appointment-status';
import { FranchiseNotFoundError } from '@/shared/errors/franchise-not-found-error';
import { PatientNotFoundError } from '@/shared/errors/patient-not-found-error';
import { AppointmentConflictError } from '@/shared/errors/apoointment-conflict-error';

interface CreateAppointmentUseCaseRequest {
  professionalId : string
  franchiseId : string
  patientId : string
  name : string
  appointmentItems : AppointmentItem[]
  startAt : Date
  durationInMinutes : number
}

type CreateAppointmentUseCaseResponse = Either<
  ProfessionalNotFoundError | FranchiseNotFoundError | PatientNotFoundError | AppointmentConflictError,
  {
    appointment: Appointment;
  }
>;

export class CreateAppointmentUseCase {
  constructor(
    private professionalRepository: ProfessionalRepository,
    private franchiseRepository: FranchiseRepository,
    private patientRepository: PatientRepository,
    private appointmentsRepository: AppointmentsRepository
  ) {}

  async execute({ professionalId, franchiseId, patientId, name, appointmentItems, startAt, durationInMinutes }: CreateAppointmentUseCaseRequest) {
   
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

    const appointmentConflict = await this.appointmentsRepository.findByProfessionalIdAndHourRange(professionalId, startAt, endAt);

    if(appointmentConflict) {
      return makeLeft(new AppointmentConflictError(appointmentConflict.startAt));
    }
    
    const appointment = Appointment.create({
      professionalId: new UniqueEntityId(professionalId),
      franchiseId: new UniqueEntityId(franchiseId),
      patientId: new UniqueEntityId(patientId),
      name,
      appointmentItems,
      startAt,
      durationInMinutes,
      endAt,
      status: AppointmentStatus.waiting(),
    });


    await this.appointmentsRepository.create(appointment);

    return makeRight({
      appointment,
    });
  }
}
