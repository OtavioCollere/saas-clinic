import { type Either, makeLeft, makeRight } from '@/core/either/either';
import { ProcedureNotFoundError } from '@/core/errors/procedure-not-found-error';
import type { Procedure } from '@/domain/enterprise/entities/procedure';
import { ProcedureStatus } from '@/domain/enterprise/value-objects/procedure-status';
import type { ProcedureRepository } from '../../repositories/procedure-repository';

interface InactivateProcedureUseCaseRequest {
  procedureId: string;
}

type InactivateProcedureUseCaseResponse = Either<
  ProcedureNotFoundError,
  {
    procedure: Procedure;
  }
>;

export class InactivateProcedureUseCase {
  constructor(
    private procedureRepository: ProcedureRepository
  ) {}

  async execute({ procedureId }: InactivateProcedureUseCaseRequest): Promise<InactivateProcedureUseCaseResponse> {
    const procedure = await this.procedureRepository.findById(procedureId);

    if (!procedure) {
      return makeLeft(new ProcedureNotFoundError());
    }

    procedure.status = ProcedureStatus.inactive();
    procedure.updatedAt = new Date();

    await this.procedureRepository.update(procedure);

    return makeRight({ procedure });
  }
}
