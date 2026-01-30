import { isRight, unwrapEither } from '@/core/either/either';
import { makeFranchise } from 'test/factories/makeFranchise';
import { makeProcedure } from 'test/factories/makeProcedure';
import { InMemoryProcedureRepository } from 'test/in-memory-repositories/in-memory-procedure-repository';
import { beforeEach, describe, expect, it } from 'vitest';
import { FetchProceduresByFranchiseIdUseCase } from '../fetch-procedures-by-franchise-id';

describe('FetchProceduresByFranchiseIdUseCase Unit Tests', () => {
  let sut: FetchProceduresByFranchiseIdUseCase;
  let inMemoryProcedureRepository: InMemoryProcedureRepository;

  beforeEach(() => {
    inMemoryProcedureRepository = new InMemoryProcedureRepository();
    sut = new FetchProceduresByFranchiseIdUseCase(inMemoryProcedureRepository);
  });

  it('should be able to fetch procedures by franchise id', async () => {
    const franchise = makeFranchise();
    const procedure1 = makeProcedure({
      franchiseId: franchise.id,
    });
    const procedure2 = makeProcedure({
      franchiseId: franchise.id,
    });
    const otherProcedure = makeProcedure();

    inMemoryProcedureRepository.items.push(procedure1, procedure2, otherProcedure);

    const result = await sut.execute({
      franchiseId: franchise.id.toString(),
    });

    expect(isRight(result)).toBeTruthy();
    if (isRight(result)) {
      expect(unwrapEither(result).procedures).toHaveLength(2);
      expect(unwrapEither(result).procedures[0].id.toString()).toEqual(procedure1.id.toString());
      expect(unwrapEither(result).procedures[1].id.toString()).toEqual(procedure2.id.toString());
    }
  });

  it('should return empty array when franchise has no procedures', async () => {
    const franchise = makeFranchise();

    const result = await sut.execute({
      franchiseId: franchise.id.toString(),
    });

    expect(isRight(result)).toBeTruthy();
    if (isRight(result)) {
      expect(unwrapEither(result).procedures).toHaveLength(0);
    }
  });
});
