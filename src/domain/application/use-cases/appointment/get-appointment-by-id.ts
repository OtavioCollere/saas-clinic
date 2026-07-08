import { Inject, Injectable } from '@nestjs/common';
import { type Either, makeLeft, makeRight } from '@/shared/either/either';
import { AppointmentNotFoundError } from '@/shared/errors/appointment-not-found-error';
import { AppointmentsRepository } from '../../repositories/appointments-repository';
import { Appointment } from '@/domain/enterprise/entities/appointment';
import { PatientRepository } from '../../repositories/patient-repository';
import { ProfessionalRepository } from '../../repositories/professional-repository';
import { UsersRepository } from '../../repositories/users-repository';
import type { Patient } from '@/domain/enterprise/entities/patient';
import type { Professional } from '@/domain/enterprise/entities/professional';
import type { User } from '@/domain/enterprise/entities/user';

interface GetAppointmentByIdUseCaseRequest {
  appointmentId: string;
}

type GetAppointmentByIdUseCaseResponse = Either<
  AppointmentNotFoundError,
  {
    appointment: Appointment;
    patient: Patient | null;
    professional: Professional | null;
    user: User | null;
  }
>;

@Injectable()
export class GetAppointmentByIdUseCase {
  constructor(
    @Inject(AppointmentsRepository)
    private appointmentsRepository: AppointmentsRepository,
    @Inject(PatientRepository)
    private patientRepository: PatientRepository,
    @Inject(ProfessionalRepository)
    private professionalRepository: ProfessionalRepository,
    @Inject(UsersRepository)
    private usersRepository: UsersRepository
  ) {}

  async execute({ appointmentId }: GetAppointmentByIdUseCaseRequest): Promise<GetAppointmentByIdUseCaseResponse> {
    const appointment = await this.appointmentsRepository.findById(appointmentId);

    if (!appointment) {
      return makeLeft(new AppointmentNotFoundError());
    }

    const patient = await this.patientRepository.findById(appointment.patientId.toString());
    const professional = await this.professionalRepository.findById(appointment.professionalId.toString());
    const user = professional ? await this.usersRepository.findById(professional.userId.toString()) : null;

    return makeRight({
      appointment,
      patient: patient || null,
      professional: professional || null,
      user: user || null,
    });
  }
}

