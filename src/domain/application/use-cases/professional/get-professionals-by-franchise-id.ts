import { type Either, makeLeft, makeRight } from '@/core/either/either';
import { FranchiseNotFoundError } from '@/core/errors/franchise-not-found-error';
import type { Professional } from '@/domain/enterprise/entities/professional';
import type { FranchiseRepository } from '../../repositories/franchise-repository';
import type { ProfessionalRepository } from '../../repositories/professional-repository';

interface GetProfessionalsByFranchiseIdUseCaseRequest {
  franchiseId: string;
}

type GetProfessionalsByFranchiseIdUseCaseResponse = Either<
  FranchiseNotFoundError,
  {
    professionals: Professional[];
  }
>;

export class GetProfessionalsByFranchiseIdUseCase {
  constructor(
    private professionalRepository: ProfessionalRepository,
    private franchiseRepository: FranchiseRepository
  ) {}

  async execute({
    franchiseId,
  }: GetProfessionalsByFranchiseIdUseCaseRequest): Promise<GetProfessionalsByFranchiseIdUseCaseResponse> {
    const franchise = await this.franchiseRepository.findById(franchiseId);

    if (!franchise) {
      return makeLeft(new FranchiseNotFoundError());
    }

    const professionals = await this.professionalRepository.findByFranchiseId(franchiseId);

    return makeRight({ professionals });
  }
}
