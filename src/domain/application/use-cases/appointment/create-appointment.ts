import { type Either, makeLeft, makeRight } from '@/core/either/either';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { ClinicAlreadyExistsError } from '@/core/errors/clinic-already-exists-error';
import { OwnerNotFoundError } from '@/core/errors/owner-not-found-error';
import { Clinic } from '@/domain/enterprise/entities/clinic';
import { ClinicMembership } from '@/domain/enterprise/entities/clinic-membership';
import { ClinicRole } from '@/domain/enterprise/value-objects/clinic-role';
import { Slug } from '@/domain/enterprise/value-objects/slug';
import type { ClinicMembershipRepository } from '../../repositories/clinic-membership-repository';
import type { ClinicRepository } from '../../repositories/clinic-repository';
import type { UsersRepository } from '../../repositories/users-repository';
import { AppointmentItem } from '@/domain/enterprise/entities/appointment-item';
import { ProfessionalRepository } from '../../repositories/professional-repository';
import { FranchiseRepository } from '../../repositories/franchise-repository';
import { PatientRepository } from '../../repositories/patient-repository';
import { ProfessionalNotFoundError } from '@/core/errors/professional-not-found-error';
import { AppointmentsRepository } from '../../repositories/appointments-repository';
import { Appointment } from '@/domain/enterprise/entities/appointment';
import { AppointmentStatus } from '@/domain/enterprise/value-objects/appointment-status';

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
  OwnerNotFoundError | ClinicAlreadyExistsError,
  {
    clinic: Clinic;
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
      return makeLeft(new AppointmentConflictError());
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
