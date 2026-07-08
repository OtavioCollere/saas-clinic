import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { type Either, makeLeft, makeRight } from '@/shared/either/either';
import { UniqueEntityId } from '@/shared/entities/unique-entity-id';
import { AppointmentItem } from '@/domain/enterprise/entities/appointment-item';
import { ProfessionalRepository } from '../../repositories/professional-repository';
import { FranchiseRepository } from '../../repositories/franchise-repository';
import { PatientRepository } from '../../repositories/patient-repository';
import { UsersRepository } from '../../repositories/users-repository';
import { ProfessionalNotFoundError } from '@/shared/errors/professional-not-found-error';
import { FranchiseNotFoundError } from '@/shared/errors/franchise-not-found-error';
import { PatientNotFoundError } from '@/shared/errors/patient-not-found-error';
import { AppointmentConflictError } from '@/shared/errors/appointment-conflict-error';
import { AppointmentInPastError } from '@/shared/errors/appointment-in-past-error';
import { AppointmentsRepository } from '../../repositories/appointments-repository';
import { Appointment } from '@/domain/enterprise/entities/appointment';
import { AppointmentStatus } from '@/domain/enterprise/value-objects/appointment-status';
import { AppointmentCreatedEvent } from '@/domain/enterprise/events/appointment-created.event';

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
  ProfessionalNotFoundError | FranchiseNotFoundError | PatientNotFoundError | AppointmentConflictError | AppointmentInPastError,
  {
    appointment: Appointment;
  }
>;

@Injectable()
export class CreateAppointmentUseCase {
  constructor(
    @Inject(ProfessionalRepository)
    private professionalRepository: ProfessionalRepository,
    @Inject(FranchiseRepository)
    private franchiseRepository: FranchiseRepository,
    @Inject(PatientRepository)
    private patientRepository: PatientRepository,
    @Inject(UsersRepository)
    private usersRepository: UsersRepository,
    @Inject(AppointmentsRepository)
    private appointmentsRepository: AppointmentsRepository,
    @Inject(EventEmitter2)
    private eventEmitter: EventEmitter2,
  ) {}

  async execute({ professionalId, franchiseId, patientId, name, appointmentItems, startAt, durationInMinutes }: CreateAppointmentUseCaseRequest) {
    if (startAt.getTime() <= Date.now()) {
      return makeLeft(new AppointmentInPastError());
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
      return makeLeft(new AppointmentConflictError(appointmentConflict.startAt, appointmentConflict.endAt));
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

    const user = await this.usersRepository.findById(patient.userId.toString());
    const professionalUser = await this.usersRepository.findById(professional.userId.toString());

    if (user) {
      this.eventEmitter.emit(
        'appointment.created',
        new AppointmentCreatedEvent(
          appointment.id.toString(),
          patient.name,
          user.email.getValue(),
          appointment.name,
          appointment.startAt,
          franchise.clinicId.toString(),
          user.phone,
          professionalUser?.name,
          franchise.address,
        ),
      );
    }

    return makeRight({
      appointment,
    });
  }
}
