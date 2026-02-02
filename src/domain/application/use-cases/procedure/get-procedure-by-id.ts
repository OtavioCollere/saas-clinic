import { type Either, makeLeft, makeRight } from '@/shared/either/either';
import { ProcedureNotFoundError } from '@/shared/errors/procedure-not-found-error';
import type { Procedure } from '@/domain/enterprise/entities/procedure';
import type { ProcedureRepository } from '../../repositories/procedure-repository';

interface GetProcedureByIdUseCaseRequest {
  procedureId: string;
}

type GetProcedureByIdUseCaseResponse = Either<
  ProcedureNotFoundError,
  { procedure: Procedure }
>;

export class GetProcedureByIdUseCase {
  constructor(private procedureRepository: ProcedureRepository) {}

  async execute({
    procedureId,
  }: GetProcedureByIdUseCaseRequest): Promise<GetProcedureByIdUseCaseResponse> {
    const procedure = await this.procedureRepository.findById(procedureId);

    if (!procedure) {
      return makeLeft(new ProcedureNotFoundError());
    }

    return makeRight({ procedure });
  }
}
