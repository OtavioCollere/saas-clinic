import { isLeft, isRight, unwrapEither } from '@/shared/either/either';
import { ProcedureNotFoundError } from '@/shared/errors/procedure-not-found-error';
import { makeProcedure } from 'test/factories/makeProcedure';
import { InMemoryProcedureRepository } from 'test/in-memory-repositories/in-memory-procedure-repository';
import { beforeEach, describe, expect, it } from 'vitest';
import { GetProcedureByIdUseCase } from '../get-procedure-by-id';

describe('GetProcedureByIdUseCase Unit Tests', () => {
  let sut: GetProcedureByIdUseCase;
  let inMemoryProcedureRepository: InMemoryProcedureRepository;

  beforeEach(() => {
    inMemoryProcedureRepository = new InMemoryProcedureRepository();
    sut = new GetProcedureByIdUseCase(inMemoryProcedureRepository);
  });

  it('should be able to get a procedure by id', async () => {
    const procedure = makeProcedure({
      name: 'Procedure Name',
      price: 100.0,
    });
    inMemoryProcedureRepository.items.push(procedure);

    const result = await sut.execute({
      procedureId: procedure.id.toString(),
    });

    expect(isRight(result)).toBeTruthy();
    if (isRight(result)) {
      expect(unwrapEither(result).procedure.id.toString()).toEqual(procedure.id.toString());
      expect(unwrapEither(result).procedure.name).toEqual('Procedure Name');
      expect(unwrapEither(result).procedure.price).toEqual(100.0);
    }
  });

  it('should not be able to get a non existent procedure', async () => {
    const result = await sut.execute({
      procedureId: 'non-existent-procedure-id',
    });

    expect(isLeft(result)).toBeTruthy();
    expect(unwrapEither(result)).toBeInstanceOf(ProcedureNotFoundError);
  });
});
