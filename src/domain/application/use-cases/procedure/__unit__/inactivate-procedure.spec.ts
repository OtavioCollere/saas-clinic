import { isLeft, isRight, unwrapEither } from '@/shared/either/either';
import { ProcedureNotFoundError } from '@/shared/errors/procedure-not-found-error';
import { ProcedureStatus } from '@/domain/enterprise/value-objects/procedure-status';
import { makeProcedure } from 'test/factories/makeProcedure';
import { InMemoryProcedureRepository } from 'test/in-memory-repositories/in-memory-procedure-repository';
import { beforeEach, describe, expect, it } from 'vitest';
import { InactivateProcedureUseCase } from '../inactivate-procedure';

describe('InactivateProcedureUseCase Unit Tests', () => {
  let sut: InactivateProcedureUseCase;
  let inMemoryProcedureRepository: InMemoryProcedureRepository;

  beforeEach(() => {
    inMemoryProcedureRepository = new InMemoryProcedureRepository();
    sut = new InactivateProcedureUseCase(inMemoryProcedureRepository);
  });

  it('should be able to inactivate a procedure', async () => {
    const procedure = makeProcedure({
      status: ProcedureStatus.active(),
    });
    inMemoryProcedureRepository.items.push(procedure);

    const result = await sut.execute({
      procedureId: procedure.id.toString(),
    });

    expect(isRight(result)).toBeTruthy();
    if (isRight(result)) {
      expect(unwrapEither(result).procedure.status.isInactive()).toBe(true);
      expect(unwrapEither(result).procedure.updatedAt).toBeDefined();
    }
  });

  it('should not be able to inactivate a non existent procedure', async () => {
    const result = await sut.execute({
      procedureId: 'non-existent-procedure-id',
    });

    expect(isLeft(result)).toBeTruthy();
    expect(unwrapEither(result)).toBeInstanceOf(ProcedureNotFoundError);
  });
});
