import { isLeft, isRight, unwrapEither } from '@/core/either/either';
import { FranchiseNotFoundError } from '@/core/errors/franchise-not-found-error';
import { ProfessionalAlreadyExistsError } from '@/core/errors/professional-already-exists-error';
import { UserIsNotOwnerError } from '@/core/errors/user-is-not-owner-error';
import { UserNotFoundError } from '@/core/errors/user-not-found-error';
import { ClinicRole } from '@/domain/enterprise/value-objects/clinic-role';
import { makeClinic } from 'test/factories/makeClinic';
import { makeClinicMembership } from 'test/factories/makeClinicMembership';
import { makeFranchise } from 'test/factories/makeFranchise';
import { makeProfessional } from 'test/factories/makeProfessional';
import { makeUser } from 'test/factories/makeUser';
import { InMemoryClinicMembershipRepository } from 'test/in-memory-repositories/in-memory-clinic-membership-repository';
import { InMemoryFranchiseRepository } from 'test/in-memory-repositories/in-memory-franchise-repository';
import { InMemoryProfessionalRepository } from 'test/in-memory-repositories/in-memory-professional-repository';
import { InMemoryUsersRepository } from 'test/in-memory-repositories/in-memory-users-repository';
import { beforeEach, describe, expect, it } from 'vitest';
import { CreateProfessionalUseCase } from '../create-professional';

describe('CreateProfessionalUseCase Unit Tests', () => {
  let sut: CreateProfessionalUseCase;
  let inMemoryProfessionalRepository: InMemoryProfessionalRepository;
  let inMemoryFranchiseRepository: InMemoryFranchiseRepository;
  let inMemoryUsersRepository: InMemoryUsersRepository;
  let inMemoryClinicMembershipRepository: InMemoryClinicMembershipRepository;

  beforeEach(() => {
    inMemoryProfessionalRepository = new InMemoryProfessionalRepository();
    inMemoryFranchiseRepository = new InMemoryFranchiseRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryClinicMembershipRepository = new InMemoryClinicMembershipRepository();
    sut = new CreateProfessionalUseCase(
      inMemoryProfessionalRepository,
      inMemoryFranchiseRepository,
      inMemoryUsersRepository,
      inMemoryClinicMembershipRepository
    );
  });

  it('should be able to create a professional', async () => {
    const owner = makeUser();
    const user = makeUser();
    const clinic = makeClinic({
      ownerId: owner.id,
    });
    const franchise = makeFranchise({
      clinicId: clinic.id,
    });
    const membership = makeClinicMembership({
      userId: owner.id,
      clinicId: clinic.id,
      role: ClinicRole.owner(),
    });

    inMemoryUsersRepository.items.push(owner, user);
    inMemoryFranchiseRepository.items.push(franchise);
    inMemoryClinicMembershipRepository.items.push(membership);

    const result = await sut.execute({
      franchiseId: franchise.id.toString(),
      userId: user.id.toString(),
      ownerId: owner.id.toString(),
      council: 'CRM',
      councilNumber: '123456',
      councilState: 'SP',
      profession: 'MEDICO',
    });

    expect(isRight(result)).toBeTruthy();
    if (isRight(result)) {
      expect(unwrapEither(result).professional.userId.toString()).toEqual(user.id.toString());
      expect(unwrapEither(result).professional.franchiseId.toString()).toEqual(franchise.id.toString());
      expect(unwrapEither(result).professional.council.getValue()).toEqual('CRM');
      expect(unwrapEither(result).professional.councilNumber).toEqual('123456');
      expect(unwrapEither(result).professional.councilState).toEqual('SP');
      expect(unwrapEither(result).professional.profession.getValue()).toEqual('MEDICO');
    }
  });

  it('should not be able to create a professional with non existent user', async () => {
    const owner = makeUser();
    const clinic = makeClinic({
      ownerId: owner.id,
    });
    const franchise = makeFranchise({
      clinicId: clinic.id,
    });
    const membership = makeClinicMembership({
      userId: owner.id,
      clinicId: clinic.id,
      role: ClinicRole.owner(),
    });

    inMemoryUsersRepository.items.push(owner);
    inMemoryFranchiseRepository.items.push(franchise);
    inMemoryClinicMembershipRepository.items.push(membership);

    const result = await sut.execute({
      franchiseId: franchise.id.toString(),
      userId: 'non-existent-user-id',
      ownerId: owner.id.toString(),
      council: 'CRM',
      councilNumber: '123456',
      councilState: 'SP',
      profession: 'MEDICO',
    });

    expect(isLeft(result)).toBeTruthy();
    expect(unwrapEither(result)).toBeInstanceOf(UserNotFoundError);
  });

  it('should not be able to create a professional with non existent franchise', async () => {
    const owner = makeUser();
    const user = makeUser();
    const clinic = makeClinic({
      ownerId: owner.id,
    });
    const membership = makeClinicMembership({
      userId: owner.id,
      clinicId: clinic.id,
      role: ClinicRole.owner(),
    });

    inMemoryUsersRepository.items.push(owner, user);
    inMemoryClinicMembershipRepository.items.push(membership);

    const result = await sut.execute({
      franchiseId: 'non-existent-franchise-id',
      userId: user.id.toString(),
      ownerId: owner.id.toString(),
      council: 'CRM',
      councilNumber: '123456',
      councilState: 'SP',
      profession: 'MEDICO',
    });

    expect(isLeft(result)).toBeTruthy();
    expect(unwrapEither(result)).toBeInstanceOf(FranchiseNotFoundError);
  });

  it('should not be able to create a professional when user is not the owner', async () => {
    const owner = makeUser();
    const otherUser = makeUser();
    const user = makeUser();
    const clinic = makeClinic({
      ownerId: owner.id,
    });
    const franchise = makeFranchise({
      clinicId: clinic.id,
    });
    const membership = makeClinicMembership({
      userId: owner.id,
      clinicId: clinic.id,
      role: ClinicRole.owner(),
    });

    inMemoryUsersRepository.items.push(owner, otherUser, user);
    inMemoryFranchiseRepository.items.push(franchise);
    inMemoryClinicMembershipRepository.items.push(membership);

    const result = await sut.execute({
      franchiseId: franchise.id.toString(),
      userId: user.id.toString(),
      ownerId: otherUser.id.toString(),
      council: 'CRM',
      councilNumber: '123456',
      councilState: 'SP',
      profession: 'MEDICO',
    });

    expect(isLeft(result)).toBeTruthy();
    expect(unwrapEither(result)).toBeInstanceOf(UserIsNotOwnerError);
  });

  it('should not be able to create a professional that already exists', async () => {
    const owner = makeUser();
    const user = makeUser();
    const clinic = makeClinic({
      ownerId: owner.id,
    });
    const franchise = makeFranchise({
      clinicId: clinic.id,
    });
    const membership = makeClinicMembership({
      userId: owner.id,
      clinicId: clinic.id,
      role: ClinicRole.owner(),
    });
    const existingProfessional = makeProfessional({
      userId: user.id,
      franchiseId: franchise.id,
    });

    inMemoryUsersRepository.items.push(owner, user);
    inMemoryFranchiseRepository.items.push(franchise);
    inMemoryClinicMembershipRepository.items.push(membership);
    inMemoryProfessionalRepository.items.push(existingProfessional);

    const result = await sut.execute({
      franchiseId: franchise.id.toString(),
      userId: user.id.toString(),
      ownerId: owner.id.toString(),
      council: 'CRM',
      councilNumber: '123456',
      councilState: 'SP',
      profession: 'MEDICO',
    });

    expect(isLeft(result)).toBeTruthy();
    expect(unwrapEither(result)).toBeInstanceOf(ProfessionalAlreadyExistsError);
  });
});

