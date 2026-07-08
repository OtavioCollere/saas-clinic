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

interface FetchAppointmentsByPatientIdUseCaseRequest {
  patientId: string;
  period?: 'active' | 'history';
}

type FetchAppointmentsByPatientIdUseCaseResponse = Either<
  never,
  {
    appointments: Appointment[];
    patient: Patient | null;
    professionals: Map<string, Professional>;
    users: Map<string, User>;
  }
>;

@Injectable()
export class FetchAppointmentsByPatientIdUseCase {
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

  async execute({ patientId, period }: FetchAppointmentsByPatientIdUseCaseRequest): Promise<FetchAppointmentsByPatientIdUseCaseResponse> {
    const appointments = await this.appointmentsRepository.findByPatientId(patientId, { period });
    const professionalIds = [...new Set(appointments.map((a) => a.professionalId.toString()))];

    const professionals = await Promise.all(
      professionalIds.map((id) => this.professionalRepository.findById(id)),
    );
    const professionalsMap = new Map<string, Professional>();
    professionals.forEach((p) => {
      if (p) professionalsMap.set(p.id.toString(), p);
    });

    const userIds = [...new Set(professionals.filter(Boolean).map((p) => p!.userId.toString()))];
    const users = await Promise.all(userIds.map((id) => this.usersRepository.findById(id)));
    const usersMap = new Map<string, User>();
    users.forEach((u) => {
      if (u) usersMap.set(u.id.toString(), u);
    });

    const patient = await this.patientRepository.findById(patientId);

    return makeRight({
      appointments,
      patient: patient ?? null,
      professionals: professionalsMap,
      users: usersMap,
    });
  }
}
