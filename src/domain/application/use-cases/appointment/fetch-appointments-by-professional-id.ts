import { Inject, Injectable } from '@nestjs/common';
import { type Either, makeRight } from '@/shared/either/either';
import type { Appointment } from '@/domain/enterprise/entities/appointment';
import type { Patient } from '@/domain/enterprise/entities/patient';
import type { Professional } from '@/domain/enterprise/entities/professional';
import type { User } from '@/domain/enterprise/entities/user';
import { AppointmentsRepository } from '../../repositories/appointments-repository';
import { PatientRepository } from '../../repositories/patient-repository';
import { ProfessionalRepository } from '../../repositories/professional-repository';
import { UsersRepository } from '../../repositories/users-repository';

interface FetchAppointmentsByProfessionalIdUseCaseRequest {
  professionalId: string;
  period?: 'active' | 'history';
}

type FetchAppointmentsByProfessionalIdUseCaseResponse = Either<
  never,
  {
    appointments: Appointment[];
    professional: Professional | null;
    patients: Map<string, Patient>;
    users: Map<string, User>;
  }
>;

@Injectable()
export class FetchAppointmentsByProfessionalIdUseCase {
  constructor(
    @Inject(AppointmentsRepository)
    private readonly appointmentsRepository: AppointmentsRepository,
    @Inject(PatientRepository)
    private readonly patientRepository: PatientRepository,
    @Inject(ProfessionalRepository)
    private readonly professionalRepository: ProfessionalRepository,
    @Inject(UsersRepository)
    private readonly usersRepository: UsersRepository,
  ) {}

  async execute({ professionalId, period }: FetchAppointmentsByProfessionalIdUseCaseRequest): Promise<FetchAppointmentsByProfessionalIdUseCaseResponse> {
    const appointments = await this.appointmentsRepository.findByProfessionalId(professionalId, { period });
    const patientIds = [...new Set(appointments.map((a) => a.patientId.toString()))];

    const patients = await Promise.all(
      patientIds.map((id) => this.patientRepository.findById(id)),
    );
    const patientsMap = new Map<string, Patient>();
    patients.forEach((p) => {
      if (p) patientsMap.set(p.id.toString(), p);
    });

    const professional = await this.professionalRepository.findById(professionalId);
    const userId = professional?.userId.toString();
    const user = userId ? await this.usersRepository.findById(userId) : null;
    const usersMap = new Map<string, User>();
    if (user) usersMap.set(user.id.toString(), user);

    return makeRight({
      appointments,
      professional: professional ?? null,
      patients: patientsMap,
      users: usersMap,
    });
  }
}
