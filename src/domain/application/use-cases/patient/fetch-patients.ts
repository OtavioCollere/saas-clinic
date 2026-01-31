import { type Either, makeRight } from '@/shared/either/either';
import type { Patient } from '@/domain/enterprise/entities/patient';
import type { PatientRepository } from '../../repositories/patient-repository';

interface FetchPatientsUseCaseRequest {
  page: number;
  pageSize?: number;
  query?: string;
}

type FetchPatientsUseCaseResponse = Either<never, { patients: Patient[] }>;

export class FetchPatientsUseCase {
  constructor(private patientRepository: PatientRepository) {}

  async execute({
    page,
    pageSize = 20,
    query,
  }: FetchPatientsUseCaseRequest): Promise<FetchPatientsUseCaseResponse> {
    const patients = await this.patientRepository.fetch({
      page,
      pageSize,
      query,
    });

    return makeRight({ patients });
  }
}
