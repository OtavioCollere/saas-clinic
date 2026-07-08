import { Inject, Injectable } from '@nestjs/common';
import { type Either, makeLeft, makeRight } from '@/shared/either/either';
import { ClinicNotFoundError } from '@/shared/errors/clinic-not-found-error';
import type { Franchise } from '@/domain/enterprise/entities/franchise';
import { ClinicRepository } from '../../repositories/clinic-repository';
import { FranchiseRepository } from '../../repositories/franchise-repository';

interface FetchFranchisesByClinicIdUseCaseRequest {
  clinicId: string;
}

type FetchFranchisesByClinicIdUseCaseResponse = Either<
  ClinicNotFoundError,
  {
    franchises: Franchise[];
  }
>;

@Injectable()
export class FetchFranchisesByClinicIdUseCase {
  constructor(
    @Inject(FranchiseRepository)
    private franchiseRepository: FranchiseRepository,
    @Inject(ClinicRepository)
    private clinicRepository: ClinicRepository,
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

