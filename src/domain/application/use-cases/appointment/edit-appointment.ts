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
    appointmentId : string
  professionalId : string
  franchiseId : string
  patientId : string
  name : string
  appointmentItems : AppointmentItem[]
  startAt : Date
  durationInMinutes : number
}

type EditAppointmentUseCaseResponse = Either<
  AppointmentNotFoundError | ProfessionalNotFoundError | FranchiseNotFoundError | PatientNotFoundError | AppointmentConflictError,
  {
    appointment: Appointment;
  }
>;

export class EditAppointmentUseCase {
  constructor(
    private professionalRepository: ProfessionalRepository,
    private franchiseRepository: FranchiseRepository,
    private patientRepository: PatientRepository,
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

    const appointmentConflict = await this.appointmentsRepository.findByProfessionalIdAndHourRange(professionalId, startAt, endAt);

    if(appointmentConflict) {
      return makeLeft(new AppointmentConflictError());
    }
    
    if (professionalId) appointment.professionalId = new UniqueEntityId(professionalId) ;
    if (franchiseId) appointment.franchiseId = new UniqueEntityId(franchiseId) ;
    if (patientId) appointment.patientId = new UniqueEntityId(patientId) ;
    if (name) appointment.name = name;
    if (appointmentItems) appointment.appointmentItems = appointmentItems;
    appointment.startAt = startAt;
    if (durationInMinutes) {
      const newEndAt = new Date(startAt.getTime() + durationInMinutes * 60000);
      appointment.endAt = newEndAt;
    }
    appointment.status = AppointmentStatus.waiting();

    await this.appointmentsRepository.update(appointment);

    return makeRight({
      appointment,
    });
  }
}
