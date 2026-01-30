import { type Either, makeRight } from '@/core/either/either';
import type { Procedure } from '@/domain/enterprise/entities/procedure';
import type { ProcedureRepository } from '../../repositories/procedure-repository';

interface FetchProceduresByFranchiseIdUseCaseRequest {
  franchiseId: string;
}

type FetchProceduresByFranchiseIdUseCaseResponse = Either<
  never,
  {
    procedures: Procedure[];
  }
>;

export class FetchProceduresByFranchiseIdUseCase {
  constructor(
    private procedureRepository: ProcedureRepository
  ) {}

  async execute({ franchiseId }: FetchProceduresByFranchiseIdUseCaseRequest): Promise<FetchProceduresByFranchiseIdUseCaseResponse> {
    const procedures = await this.procedureRepository.findByFranchiseId(franchiseId);

    return makeRight({
      procedures,
    });
  }
}
