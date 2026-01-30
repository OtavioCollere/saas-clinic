import { type Either, makeLeft, makeRight } from '@/core/either/either';
import { ProcedureNotFoundError } from '@/core/errors/procedure-not-found-error';
import type { Procedure } from '@/domain/enterprise/entities/procedure';
import type { ProcedureRepository } from '../../repositories/procedure-repository';

interface EditProcedureUseCaseRequest {
  procedureId: string;
  name?: string;
  price?: number;
  notes?: string;
}

type EditProcedureUseCaseResponse = Either<
  ProcedureNotFoundError,
  {
    procedure: Procedure;
  }
>;

export class EditProcedureUseCase {
  constructor(
    private procedureRepository: ProcedureRepository
  ) {}

  async execute({ procedureId, name, price, notes }: EditProcedureUseCaseRequest): Promise<EditProcedureUseCaseResponse> {
    const procedure = await this.procedureRepository.findById(procedureId);

    if (!procedure) {
      return makeLeft(new ProcedureNotFoundError());
    }

    if (name) {
      procedure.name = name;
    }

    if (price !== undefined) {
      procedure.price = price;
    }

    if (notes !== undefined) {
      procedure.notes = notes;
    }

    procedure.updatedAt = new Date();

    await this.procedureRepository.update(procedure);

    return makeRight({ procedure });
  }
}
