import { type Either, makeLeft, makeRight } from '@/shared/either/either';
import type { Clinic } from '@/domain/enterprise/entities/clinic';
import type { ClinicRepository } from '../../repositories/clinic-repository';

interface FetchClinicUseCaseRequest {
  page: number;
  pageSize?: number;
  query?: string;
}

type FetchClinicUseCaseResponse = Either<never, { clinics: Clinic[] }>;

export class FetchClinicUseCase {
  constructor(private clinicRepository: ClinicRepository) {}

  async execute({
    page,
    pageSize = 20,
    query,
  }: FetchClinicUseCaseRequest): Promise<FetchClinicUseCaseResponse> {
    const clinics = await this.clinicRepository.fetch({
      page,
      pageSize,
      query,
    });

    return makeRight({ clinics });
  }
}
