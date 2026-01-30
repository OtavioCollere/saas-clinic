import { isLeft, isRight, unwrapEither } from '@/core/either/either';
import { ProcedureNotFoundError } from '@/core/errors/procedure-not-found-error';
import { makeProcedure } from 'test/factories/makeProcedure';
import { InMemoryProcedureRepository } from 'test/in-memory-repositories/in-memory-procedure-repository';
import { beforeEach, describe, expect, it } from 'vitest';
import { EditProcedureUseCase } from '../edit-procedure';

describe('EditProcedureUseCase Unit Tests', () => {
  let sut: EditProcedureUseCase;
  let inMemoryProcedureRepository: InMemoryProcedureRepository;

  beforeEach(() => {
    inMemoryProcedureRepository = new InMemoryProcedureRepository();
    sut = new EditProcedureUseCase(inMemoryProcedureRepository);
  });

  it('should be able to edit a procedure', async () => {
    const procedure = makeProcedure({
      name: 'Old Name',
      price: 100.0,
      notes: 'Old notes',
    });
    inMemoryProcedureRepository.items.push(procedure);

    const result = await sut.execute({
      procedureId: procedure.id.toString(),
      name: 'New Name',
      price: 200.0,
      notes: 'New notes',
    });

    expect(isRight(result)).toBeTruthy();
    if (isRight(result)) {
      expect(unwrapEither(result).procedure.name).toEqual('New Name');
      expect(unwrapEither(result).procedure.price).toEqual(200.0);
      expect(unwrapEither(result).procedure.notes).toEqual('New notes');
      expect(unwrapEither(result).procedure.updatedAt).toBeDefined();
    }
  });

  it('should not be able to edit a non existent procedure', async () => {
    const result = await sut.execute({
      procedureId: 'non-existent-procedure-id',
      name: 'New Name',
    });

    expect(isLeft(result)).toBeTruthy();
    expect(unwrapEither(result)).toBeInstanceOf(ProcedureNotFoundError);
  });
});
