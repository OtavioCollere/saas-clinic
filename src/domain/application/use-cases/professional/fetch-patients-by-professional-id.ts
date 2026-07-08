import { Inject, Injectable } from '@nestjs/common';
import { type Either, makeRight } from '@/shared/either/either';
import type { Patient } from '@/domain/enterprise/entities/patient';
import { AppointmentsRepository } from '../../repositories/appointments-repository';
import { PatientRepository } from '../../repositories/patient-repository';

interface FetchPatientsByProfessionalIdUseCaseRequest {
  professionalId: string;
}

type FetchPatientsByProfessionalIdUseCaseResponse = Either<
  never,
  { patients: Patient[] }
>;

@Injectable()
export class FetchPatientsByProfessionalIdUseCase {
  constructor(
    @Inject(AppointmentsRepository)
    private readonly appointmentsRepository: AppointmentsRepository,
    @Inject(PatientRepository)
    private readonly patientRepository: PatientRepository,
  ) {}

  async execute({
    professionalId,
  }: FetchPatientsByProfessionalIdUseCaseRequest): Promise<FetchPatientsByProfessionalIdUseCaseResponse> {
    const appointments = await this.appointmentsRepository.findByProfessionalId(professionalId);

    const uniquePatientIds = [...new Set(appointments.map((a) => a.patientId.toString()))];

    const patients = (
      await Promise.all(uniquePatientIds.map((id) => this.patientRepository.findById(id)))
    ).filter((p): p is Patient => p !== null);

    return makeRight({ patients });
  }
}
