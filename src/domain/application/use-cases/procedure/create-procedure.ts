import { type Either, makeLeft, makeRight } from '@/shared/either/either';
import { UniqueEntityId } from '@/shared/entities/unique-entity-id';
import { FranchiseNotFoundError } from '@/shared/errors/franchise-not-found-error';
import { Procedure } from '@/domain/enterprise/entities/procedure';
import { ProcedureStatus } from '@/domain/enterprise/value-objects/procedure-status';
import type { FranchiseRepository } from '../../repositories/franchise-repository';
import type { ProcedureRepository } from '../../repositories/procedure-repository';

interface CreateProcedureUseCaseRequest {
  franchiseId: string;
  name: string;
  price: number;
  notes?: string;
}

type CreateProcedureUseCaseResponse = Either<
  FranchiseNotFoundError,
  {
    procedure: Procedure;
  }
>;

export class CreateProcedureUseCase {
  constructor(
    private procedureRepository: ProcedureRepository,
    private franchiseRepository: FranchiseRepository
  ) {}

  async execute({ franchiseId, name, price, notes }: CreateProcedureUseCaseRequest): Promise<CreateProcedureUseCaseResponse> {
    const franchise = await this.franchiseRepository.findById(franchiseId);

    if (!franchise) {
      return makeLeft(new FranchiseNotFoundError());
    }

    const procedure = Procedure.create({
      franchiseId: new UniqueEntityId(franchiseId),
      name,
      price,
      notes,
      status: ProcedureStatus.active(),
    });

    await this.procedureRepository.create(procedure);

    return makeRight({ procedure });
  }
}
