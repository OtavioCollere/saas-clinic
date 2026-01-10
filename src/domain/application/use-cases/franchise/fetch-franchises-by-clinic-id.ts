import { type Either, makeLeft, makeRight } from '@/core/either/either';
import { ClinicNotFoundError } from '@/core/errors/clinic-not-found-error';
import type { Franchise } from '@/domain/enterprise/entities/franchise';
import type { ClinicRepository } from '../../repositories/clinic-repository';
import type { FranchiseRepository } from '../../repositories/franchise-repository';

interface FetchFranchisesByClinicIdUseCaseRequest {
  clinicId: string;
}

type FetchFranchisesByClinicIdUseCaseResponse = Either<
  ClinicNotFoundError,
  {
    franchises: Franchise[];
  }
>;

export class FetchFranchisesByClinicIdUseCase {
  constructor(
    private franchiseRepository: FranchiseRepository,
    private clinicRepository: ClinicRepository
  ) {}

  async execute({
    clinicId,
  }: FetchFranchisesByClinicIdUseCaseRequest): Promise<FetchFranchisesByClinicIdUseCaseResponse> {
    const clinic = await this.clinicRepository.findById(clinicId);

    if (!clinic) {
      return makeLeft(new ClinicNotFoundError());
    }

    const franchises = await this.franchiseRepository.findByClinicId(clinicId);

    return makeRight({ franchises });
  }
}

