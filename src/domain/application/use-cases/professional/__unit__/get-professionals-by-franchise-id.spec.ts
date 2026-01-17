import { isLeft, isRight, unwrapEither } from '@/core/either/either';
import { FranchiseNotFoundError } from '@/core/errors/franchise-not-found-error';
import { Council } from '@/domain/enterprise/value-objects/council';
import { Profession } from '@/domain/enterprise/value-objects/profession';
import { makeFranchise } from 'test/factories/makeFranchise';
import { makeProfessional } from 'test/factories/makeProfessional';
import { InMemoryFranchiseRepository } from 'test/in-memory-repositories/in-memory-franchise-repository';
import { InMemoryProfessionalRepository } from 'test/in-memory-repositories/in-memory-professional-repository';
import { beforeEach, describe, expect, it } from 'vitest';
import { GetProfessionalsByFranchiseIdUseCase } from '../get-professionals-by-franchise-id';

describe('GetProfessionalsByFranchiseIdUseCase Unit Tests', () => {
  let sut: GetProfessionalsByFranchiseIdUseCase;
  let inMemoryProfessionalRepository: InMemoryProfessionalRepository;
  let inMemoryFranchiseRepository: InMemoryFranchiseRepository;

  beforeEach(() => {
    inMemoryProfessionalRepository = new InMemoryProfessionalRepository();
    inMemoryFranchiseRepository = new InMemoryFranchiseRepository();
    sut = new GetProfessionalsByFranchiseIdUseCase(
      inMemoryProfessionalRepository,
      inMemoryFranchiseRepository
    );
  });

  it('should be able to get professionals by franchise id', async () => {
    const franchise = makeFranchise();
    const professional1 = makeProfessional({
      franchiseId: franchise.id,
      council: Council.crm(),
      profession: Profession.medico(),
    });
    const professional2 = makeProfessional({
      franchiseId: franchise.id,
      council: Council.crbm(),
      profession: Profession.biomedico(),
    });
    const otherFranchise = makeFranchise();
    const professionalFromOtherFranchise = makeProfessional({
      franchiseId: otherFranchise.id,
    });

    inMemoryFranchiseRepository.items.push(franchise, otherFranchise);
    inMemoryProfessionalRepository.items.push(professional1, professional2, professionalFromOtherFranchise);

    const result = await sut.execute({
      franchiseId: franchise.id.toString(),
    });

    expect(isRight(result)).toBeTruthy();
    if (isRight(result)) {
      expect(unwrapEither(result).professionals).toHaveLength(2);
      expect(unwrapEither(result).professionals[0].id.toString()).toEqual(professional1.id.toString());
      expect(unwrapEither(result).professionals[1].id.toString()).toEqual(professional2.id.toString());
    }
  });

  it('should not be able to get professionals with non existent franchise', async () => {
    const result = await sut.execute({
      franchiseId: 'non-existent-franchise-id',
    });

    expect(isLeft(result)).toBeTruthy();
    expect(unwrapEither(result)).toBeInstanceOf(FranchiseNotFoundError);
  });

  it('should return empty array when franchise has no professionals', async () => {
    const franchise = makeFranchise();
    inMemoryFranchiseRepository.items.push(franchise);

    const result = await sut.execute({
      franchiseId: franchise.id.toString(),
    });

    expect(isRight(result)).toBeTruthy();
    if (isRight(result)) {
      expect(unwrapEither(result).professionals).toHaveLength(0);
    }
  });
});

