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

interface FetchAppointmentsByClinicIdWeekUseCaseRequest {
  clinicId: string;
}

type FetchAppointmentsByClinicIdWeekUseCaseResponse = Either<
  never,
  {
    appointments: Appointment[];
    patients: Map<string, Patient>;
    professionals: Map<string, Professional>;
    users: Map<string, User>;
  }
>;

@Injectable()
export class FetchAppointmentsByClinicIdWeekUseCase {
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

  async execute({
    clinicId,
  }: FetchAppointmentsByClinicIdWeekUseCaseRequest): Promise<FetchAppointmentsByClinicIdWeekUseCaseResponse> {
    // Calcula início e fim da semana atual (segunda a domingo)
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 = domingo, 1 = segunda, etc.
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Ajusta para começar na segunda
    
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() + diff);
    weekStart.setHours(0, 0, 0, 0);
    
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    const appointments = await this.appointmentsRepository.findByClinicIdAndWeek(
      clinicId,
      weekStart,
      weekEnd
    );

    // Busca pacientes e profissionais únicos
    const patientIds = [...new Set(appointments.map(a => a.patientId.toString()))];
    const professionalIds = [...new Set(appointments.map(a => a.professionalId.toString()))];

    // Busca pacientes
    const patients = await Promise.all(
      patientIds.map(id => this.patientRepository.findById(id))
    );
    const patientsMap = new Map<string, Patient>();
    patients.forEach(patient => {
      if (patient) {
        patientsMap.set(patient.id.toString(), patient);
      }
    });

    // Busca profissionais
    const professionals = await Promise.all(
      professionalIds.map(id => this.professionalRepository.findById(id))
    );
    const professionalsMap = new Map<string, Professional>();
    professionals.forEach(professional => {
      if (professional) {
        professionalsMap.set(professional.id.toString(), professional);
      }
    });

    // Busca usuários dos profissionais
    const professionalUserIds = [...new Set(
      professionals
        .filter(p => p)
        .map(p => p!.userId.toString())
    )];
    const users = await Promise.all(
      professionalUserIds.map(id => this.usersRepository.findById(id))
    );
    const usersMap = new Map<string, User>();
    users.forEach(user => {
      if (user) {
        usersMap.set(user.id.toString(), user);
      }
    });

    return makeRight({
      appointments,
      patients: patientsMap,
      professionals: professionalsMap,
      users: usersMap,
    });
  }
}

