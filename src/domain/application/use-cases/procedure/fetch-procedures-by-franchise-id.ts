import { Inject, Injectable } from '@nestjs/common';
import { type Either, makeRight } from '@/shared/either/either';
import type { Procedure } from '@/domain/enterprise/entities/procedure';
import { ProcedureRepository } from '../../repositories/procedure-repository';

interface FetchProceduresByFranchiseIdUseCaseRequest {
  franchiseId: string;
}

type FetchProceduresByFranchiseIdUseCaseResponse = Either<
  never,
  {
    procedures: Procedure[];
  }
>;

@Injectable()
export class FetchProceduresByFranchiseIdUseCase {
  constructor(
    @Inject(ProcedureRepository)
    private procedureRepository: ProcedureRepository
  ) {}

  async execute({ franchiseId }: FetchProceduresByFranchiseIdUseCaseRequest): Promise<FetchProceduresByFranchiseIdUseCaseResponse> {
    const procedures = await this.procedureRepository.findByFranchiseId(franchiseId);

    return makeRight({
      procedures,
    });
  }
}
