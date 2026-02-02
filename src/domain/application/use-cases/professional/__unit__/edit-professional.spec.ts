import { isLeft, isRight, unwrapEither } from '@/shared/either/either';
import { ProfessionalNotFoundError } from '@/shared/errors/professional-not-found-error';
import { UserIsNotOwnerError } from '@/shared/errors/user-is-not-owner-error';
import { ClinicRole } from '@/domain/enterprise/value-objects/clinic-role';
import { Council } from '@/domain/enterprise/value-objects/council';
import { Profession } from '@/domain/enterprise/value-objects/profession';
import { makeClinic } from 'test/factories/makeClinic';
import { makeClinicMembership } from 'test/factories/makeClinicMembership';
import { makeFranchise } from 'test/factories/makeFranchise';
import { makeProfessional } from 'test/factories/makeProfessional';
import { makeUser } from 'test/factories/makeUser';
import { InMemoryClinicMembershipRepository } from 'test/in-memory-repositories/in-memory-clinic-membership-repository';
import { InMemoryFranchiseRepository } from 'test/in-memory-repositories/in-memory-franchise-repository';
import { InMemoryProfessionalRepository } from 'test/in-memory-repositories/in-memory-professional-repository';
import { beforeEach, describe, expect, it } from 'vitest';
import { EditProfessionalUseCase } from '../edit-professional';

describe('EditProfessionalUseCase Unit Tests', () => {
  let sut: EditProfessionalUseCase;
  let inMemoryProfessionalRepository: InMemoryProfessionalRepository;
  let inMemoryFranchiseRepository: InMemoryFranchiseRepository;
  let inMemoryClinicMembershipRepository: InMemoryClinicMembershipRepository;

  beforeEach(() => {
    inMemoryProfessionalRepository = new InMemoryProfessionalRepository();
    inMemoryFranchiseRepository = new InMemoryFranchiseRepository();
    inMemoryClinicMembershipRepository = new InMemoryClinicMembershipRepository();
    sut = new EditProfessionalUseCase(
      inMemoryProfessionalRepository,
      inMemoryFranchiseRepository,
      inMemoryClinicMembershipRepository
    );
  });

  it('should be able to edit a professional', async () => {
    const owner = makeUser();
    const clinic = makeClinic({
      ownerId: owner.id,
    });
    const franchise = makeFranchise({
      clinicId: clinic.id,
    });
    const professional = makeProfessional({
      franchiseId: franchise.id,
      council: Council.crm(),
      councilNumber: '123456',
      councilState: 'SP',
      profession: Profession.medico(),
    });
    const membership = makeClinicMembership({
      userId: owner.id,
      clinicId: clinic.id,
      role: ClinicRole.owner(),
    });

    inMemoryFranchiseRepository.items.push(franchise);
    inMemoryProfessionalRepository.items.push(professional);
    inMemoryClinicMembershipRepository.items.push(membership);

    const result = await sut.execute({
      professionalId: professional.id.toString(),
      editorId: owner.id.toString(),
      council: 'CRBM',
      councilNumber: '789012',
      councilState: 'RJ',
      profession: 'BIOMEDICO',
    });

    expect(isRight(result)).toBeTruthy();
    if (isRight(result)) {
      expect(unwrapEither(result).professional.council.getValue()).toEqual('CRBM');
      expect(unwrapEither(result).professional.councilNumber).toEqual('789012');
      expect(unwrapEither(result).professional.councilState).toEqual('RJ');
      expect(unwrapEither(result).professional.profession.getValue()).toEqual('BIOMEDICO');
    }
  });

  it('should not be able to edit a non existent professional', async () => {
    const owner = makeUser();

    const result = await sut.execute({
      professionalId: 'non-existent-professional-id',
      editorId: owner.id.toString(),
      councilNumber: '789012',
    });

    expect(isLeft(result)).toBeTruthy();
    expect(unwrapEither(result)).toBeInstanceOf(ProfessionalNotFoundError);
  });

  it('should not be able to edit a professional when user is not the owner', async () => {
    const owner = makeUser();
    const otherUser = makeUser();
    const clinic = makeClinic({
      ownerId: owner.id,
    });
    const franchise = makeFranchise({
      clinicId: clinic.id,
    });
    const professional = makeProfessional({
      franchiseId: franchise.id,
    });
    const membership = makeClinicMembership({
      userId: owner.id,
      clinicId: clinic.id,
      role: ClinicRole.owner(),
    });

    inMemoryFranchiseRepository.items.push(franchise);
    inMemoryProfessionalRepository.items.push(professional);
    inMemoryClinicMembershipRepository.items.push(membership);

    const result = await sut.execute({
      professionalId: professional.id.toString(),
      editorId: otherUser.id.toString(),
      councilNumber: '789012',
    });

    expect(isLeft(result)).toBeTruthy();
    expect(unwrapEither(result)).toBeInstanceOf(UserIsNotOwnerError);
  });
});

