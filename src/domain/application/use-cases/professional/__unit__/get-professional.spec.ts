import { isLeft, isRight, unwrapEither } from '@/shared/either/either';
import { ProfessionalNotFoundError } from '@/shared/errors/professional-not-found-error';
import { Council } from '@/domain/enterprise/value-objects/council';
import { Profession } from '@/domain/enterprise/value-objects/profession';
import { makeProfessional } from 'test/factories/makeProfessional';
import { InMemoryProfessionalRepository } from 'test/in-memory-repositories/in-memory-professional-repository';
import { beforeEach, describe, expect, it } from 'vitest';
import { GetProfessionalUseCase } from '../get-professional';

describe('GetProfessionalUseCase Unit Tests', () => {
  let sut: GetProfessionalUseCase;
  let inMemoryProfessionalRepository: InMemoryProfessionalRepository;

  beforeEach(() => {
    inMemoryProfessionalRepository = new InMemoryProfessionalRepository();
    sut = new GetProfessionalUseCase(inMemoryProfessionalRepository);
  });

  it('should be able to get a professional by id', async () => {
    const professional = makeProfessional({
      council: Council.crm(),
      councilNumber: '123456',
      councilState: 'SP',
      profession: Profession.medico(),
    });
    inMemoryProfessionalRepository.items.push(professional);

    const result = await sut.execute({
      professionalId: professional.id.toString(),
    });

    expect(isRight(result)).toBeTruthy();
    if (isRight(result)) {
      expect(unwrapEither(result).professional.id.toString()).toEqual(professional.id.toString());
      expect(unwrapEither(result).professional.council.getValue()).toEqual('CRM');
      expect(unwrapEither(result).professional.councilNumber).toEqual('123456');
      expect(unwrapEither(result).professional.councilState).toEqual('SP');
      expect(unwrapEither(result).professional.profession.getValue()).toEqual('MEDICO');
    }
  });

  it('should not be able to get a non existent professional', async () => {
    const result = await sut.execute({
      professionalId: 'non-existent-professional-id',
    });

    expect(isLeft(result)).toBeTruthy();
    expect(unwrapEither(result)).toBeInstanceOf(ProfessionalNotFoundError);
  });
});

