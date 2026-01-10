import { isLeft, isRight, unwrapEither } from '@/core/either/either';
import { FranchiseNotFoundError } from '@/core/errors/franchise-not-found-error';
import { UserIsNotOwnerError } from '@/core/errors/user-is-not-owner-error';
import { FranchiseStatus } from '@/domain/enterprise/value-objects/franchise-status';
import { ClinicRole } from '@/domain/enterprise/value-objects/clinic-role';
import { makeClinic } from 'tests/factories/makeClinic';
import { makeClinicMembership } from 'tests/factories/makeClinicMembership';
import { makeFranchise } from 'tests/factories/makeFranchise';
import { makeUser } from 'tests/factories/makeUser';
import { InMemoryClinicMembershipRepository } from 'tests/in-memory-repositories/in-memory-clinic-membership-repository';
import { InMemoryFranchiseRepository } from 'tests/in-memory-repositories/in-memory-franchise-repository';
import { beforeEach, describe, expect, it } from 'vitest';
import { EditFranchiseUseCase } from '../edit-franchise';

describe('EditFranchiseUseCase Unit Tests', () => {
  let sut: EditFranchiseUseCase;
  let inMemoryFranchiseRepository: InMemoryFranchiseRepository;
  let inMemoryClinicMembershipRepository: InMemoryClinicMembershipRepository;

  beforeEach(() => {
    inMemoryFranchiseRepository = new InMemoryFranchiseRepository();
    inMemoryClinicMembershipRepository = new InMemoryClinicMembershipRepository();
    sut = new EditFranchiseUseCase(inMemoryFranchiseRepository, inMemoryClinicMembershipRepository);
  });

  it('should be able to edit a franchise', async () => {
    const user = makeUser();
    const clinic = makeClinic({
      ownerId: user.id,
    });
    const franchise = makeFranchise({
      clinicId: clinic.id,
      name: 'Original Franchise',
      address: 'Original Address',
      zipCode: '00000-000',
    });
    const membership = makeClinicMembership({
      userId: user.id,
      clinicId: clinic.id,
      role: ClinicRole.owner(),
    });
    inMemoryFranchiseRepository.items.push(franchise);
    inMemoryClinicMembershipRepository.items.push(membership);

    const result = await sut.execute({
      franchiseId: franchise.id.toString(),
      userId: user.id.toString(),
      name: 'Updated Franchise',
      address: 'Updated Address',
      zipCode: '11111-111',
      description: 'Updated description',
    });

    expect(isRight(result)).toBeTruthy();
    if (isRight(result)) {
      expect(unwrapEither(result).franchise.name).toEqual('Updated Franchise');
      expect(unwrapEither(result).franchise.address).toEqual('Updated Address');
      expect(unwrapEither(result).franchise.zipCode).toEqual('11111-111');
      expect(unwrapEither(result).franchise.description).toEqual('Updated description');
    }
  });

  it('should not be able to edit a non existent franchise', async () => {
    const user = makeUser();

    const result = await sut.execute({
      franchiseId: 'non-existent-franchise-id',
      userId: user.id.toString(),
      name: 'Updated Franchise',
    });

    expect(isLeft(result)).toBeTruthy();
    expect(unwrapEither(result)).toBeInstanceOf(FranchiseNotFoundError);
  });

  it('should not be able to edit a franchise when user is not the owner', async () => {
    const owner = makeUser();
    const otherUser = makeUser();
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
    inMemoryFranchiseRepository.items.push(franchise);
    inMemoryClinicMembershipRepository.items.push(membership);

    const result = await sut.execute({
      franchiseId: franchise.id.toString(),
      userId: otherUser.id.toString(),
      name: 'Updated Franchise',
    });

    expect(isLeft(result)).toBeTruthy();
    expect(unwrapEither(result)).toBeInstanceOf(UserIsNotOwnerError);
  });
});

