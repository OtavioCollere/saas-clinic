import { isLeft, isRight, unwrapEither } from '@/shared/either/either';
import { FranchiseNotFoundError } from '@/shared/errors/franchise-not-found-error';
import { ProcedureStatus } from '@/domain/enterprise/value-objects/procedure-status';
import { makeFranchise } from 'test/factories/makeFranchise';
import { InMemoryFranchiseRepository } from 'test/in-memory-repositories/in-memory-franchise-repository';
import { InMemoryProcedureRepository } from 'test/in-memory-repositories/in-memory-procedure-repository';
import { beforeEach, describe, expect, it } from 'vitest';
import { CreateProcedureUseCase } from '../create-procedure';

describe('CreateProcedureUseCase Unit Tests', () => {
  let sut: CreateProcedureUseCase;
  let inMemoryProcedureRepository: InMemoryProcedureRepository;
  let inMemoryFranchiseRepository: InMemoryFranchiseRepository;

  beforeEach(() => {
    inMemoryProcedureRepository = new InMemoryProcedureRepository();
    inMemoryFranchiseRepository = new InMemoryFranchiseRepository();
    sut = new CreateProcedureUseCase(
      inMemoryProcedureRepository,
      inMemoryFranchiseRepository
    );
  });

  it('should be able to create a procedure', async () => {
    const franchise = makeFranchise();
    inMemoryFranchiseRepository.items.push(franchise);

    const result = await sut.execute({
      franchiseId: franchise.id.toString(),
      name: 'Procedure Name',
      price: 100.0,
      notes: 'Procedure notes',
    });

    expect(isRight(result)).toBeTruthy();
    if (isRight(result)) {
      expect(unwrapEither(result).procedure.name).toEqual('Procedure Name');
      expect(unwrapEither(result).procedure.price).toEqual(100.0);
      expect(unwrapEither(result).procedure.notes).toEqual('Procedure notes');
      expect(unwrapEither(result).procedure.status.isActive()).toBe(true);
      expect(inMemoryProcedureRepository.items).toHaveLength(1);
    }
  });

  it('should not be able to create a procedure with non existent franchise', async () => {
    const result = await sut.execute({
      franchiseId: 'non-existent-franchise-id',
      name: 'Procedure Name',
      price: 100.0,
    });

    expect(isLeft(result)).toBeTruthy();
    expect(unwrapEither(result)).toBeInstanceOf(FranchiseNotFoundError);
  });
});
