import { type Either, makeLeft, makeRight } from '@/shared/either/either';
import { UniqueEntityId } from '@/shared/entities/unique-entity-id';
import { ClinicAlreadyExistsError } from '@/shared/errors/clinic-already-exists-error';
import { OwnerNotFoundError } from '@/shared/errors/owner-not-found-error';
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
import { ProfessionalNotFoundError } from '@/shared/errors/professional-not-found-error';
import { AppointmentsRepository } from '../../repositories/appointments-repository';
import { Appointment } from '@/domain/enterprise/entities/appointment';
import { AppointmentStatus } from '@/domain/enterprise/value-objects/appointment-status';

interface FetchAppointmentsByProfessionalIdUseCaseRequest {
  professionalId : string
  franchiseId : string
  patientId : string
  name : string
  appointmentItems : AppointmentItem[]
  startAt : Date
  durationInMinutes : number
}

type FetchAppointmentsByProfessionalIdUseCaseResponse = Either<
  OwnerNotFoundError | ClinicAlreadyExistsError,
  {
    appointments: Appointment[];
  }
>;

export class FetchAppointmentsByProfessionalIdUseCase {
  constructor(
    private professionalRepository: ProfessionalRepository,
    private franchiseRepository: FranchiseRepository,
    private patientRepository: PatientRepository,
    private appointmentsRepository: AppointmentsRepository
  ) {}

  async execute({ professionalId }: FetchAppointmentsByProfessionalIdUseCaseRequest) {  
    const appointments = await this.appointmentsRepository.findByProfessionalId(professionalId);


    return makeRight({
      appointments,
    });
  }
}
