import { isLeft, isRight, unwrapEither } from '@/core/either/either';
import { ClinicNotFoundError } from '@/core/errors/clinic-not-found-error';
import { UserIsNotOwnerError } from '@/core/errors/user-is-not-owner-error';
import { FranchiseStatus } from '@/domain/enterprise/value-objects/franchise-status';
import { ClinicRole } from '@/domain/enterprise/value-objects/clinic-role';
import { makeClinic } from 'tests/factories/makeClinic';
import { makeClinicMembership } from 'tests/factories/makeClinicMembership';
import { makeFranchise } from 'tests/factories/makeFranchise';
import { makeUser } from 'tests/factories/makeUser';
import { InMemoryClinicMembershipRepository } from 'tests/in-memory-repositories/in-memory-clinic-membership-repository';
import { InMemoryClinicRepository } from 'tests/in-memory-repositories/in-memory-clinic-repository';
import { InMemoryFranchiseRepository } from 'tests/in-memory-repositories/in-memory-franchise-repository';
import { beforeEach, describe, expect, it } from 'vitest';
import { RegisterFranchiseUseCase } from '../register-franchise';

describe('RegisterFranchiseUseCase Unit Tests', () => {
  let sut: RegisterFranchiseUseCase;
  let inMemoryClinicRepository: InMemoryClinicRepository;
  let inMemoryFranchiseRepository: InMemoryFranchiseRepository;
  let inMemoryClinicMembershipRepository: InMemoryClinicMembershipRepository;

  beforeEach(() => {
    inMemoryClinicRepository = new InMemoryClinicRepository();
    inMemoryFranchiseRepository = new InMemoryFranchiseRepository();
    inMemoryClinicMembershipRepository = new InMemoryClinicMembershipRepository();
    sut = new RegisterFranchiseUseCase(
      inMemoryClinicRepository,
      inMemoryFranchiseRepository,
      inMemoryClinicMembershipRepository
    );
  });

  it('should be able to register a franchise', async () => {
    const user = makeUser();
    const clinic = makeClinic({
      ownerId: user.id,
    });
    const membership = makeClinicMembership({
      userId: user.id,
      clinicId: clinic.id,
      role: ClinicRole.owner(),
    });
    inMemoryClinicRepository.items.push(clinic);
    inMemoryClinicMembershipRepository.items.push(membership);

    const result = await sut.execute({
      clinicId: clinic.id.toString(),
      userId: user.id.toString(),
      name: 'Franchise Test',
      address: '123 Main St',
      zipCode: '12345-678',
      description: 'Test franchise description',
    });

    expect(isRight(result)).toBeTruthy();
    if (isRight(result)) {
      expect(unwrapEither(result).franchise.name).toEqual('Franchise Test');
      expect(unwrapEither(result).franchise.address).toEqual('123 Main St');
      expect(unwrapEither(result).franchise.zipCode).toEqual('12345-678');
      expect(unwrapEither(result).franchise.description).toEqual('Test franchise description');
      expect(unwrapEither(result).franchise.status.isActive()).toBeTruthy();
    }
  });

  it('should not be able to register a franchise with non existent clinic', async () => {
    const user = makeUser();

    const result = await sut.execute({
      clinicId: 'non-existent-clinic-id',
      userId: user.id.toString(),
      name: 'Franchise Test',
      address: '123 Main St',
      zipCode: '12345-678',
    });

    expect(isLeft(result)).toBeTruthy();
    expect(unwrapEither(result)).toBeInstanceOf(ClinicNotFoundError);
  });

  it('should not be able to register a franchise when user is not the owner', async () => {
    const owner = makeUser();
    const otherUser = makeUser();
    const clinic = makeClinic({
      ownerId: owner.id,
    });
    const membership = makeClinicMembership({
      userId: owner.id,
      clinicId: clinic.id,
      role: ClinicRole.owner(),
    });
    inMemoryClinicRepository.items.push(clinic);
    inMemoryClinicMembershipRepository.items.push(membership);

    const result = await sut.execute({
      clinicId: clinic.id.toString(),
      userId: otherUser.id.toString(),
      name: 'Franchise Test',
      address: '123 Main St',
      zipCode: '12345-678',
    });

    expect(isLeft(result)).toBeTruthy();
    expect(unwrapEither(result)).toBeInstanceOf(UserIsNotOwnerError);
  });
});

