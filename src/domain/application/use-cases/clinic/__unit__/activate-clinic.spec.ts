import { isLeft, isRight, unwrapEither } from '@/shared/either/either';
import { ClinicNotFoundError } from '@/shared/errors/clinic-not-found-error';
import { UserIsNotOwnerError } from '@/shared/errors/user-is-not-owner-error';
import { ClinicStatus } from '@/domain/enterprise/value-objects/clinic-status';
import { ClinicRole } from '@/domain/enterprise/value-objects/clinic-role';
import { makeClinic } from 'tests/factories/makeClinic';
import { makeClinicMembership } from 'tests/factories/makeClinicMembership';
import { makeUser } from 'tests/factories/makeUser';
import { InMemoryClinicMembershipRepository } from 'tests/in-memory-repositories/in-memory-clinic-membership-repository';
import { InMemoryClinicRepository } from 'tests/in-memory-repositories/in-memory-clinic-repository';
import { beforeEach, describe, expect, it } from 'vitest';
import { ActivateClinicUseCase } from '../activate-clinic';

describe('ActivateClinicUseCase Unit Tests', () => {
  let sut: ActivateClinicUseCase;
  let inMemoryClinicRepository: InMemoryClinicRepository;
  let inMemoryClinicMembershipRepository: InMemoryClinicMembershipRepository;

  beforeEach(() => {
    inMemoryClinicRepository = new InMemoryClinicRepository();
    inMemoryClinicMembershipRepository = new InMemoryClinicMembershipRepository();
    sut = new ActivateClinicUseCase(inMemoryClinicRepository, inMemoryClinicMembershipRepository);
  });

  it('should be able to activate a clinic', async () => {
    const user = makeUser();
    const clinic = makeClinic({
      ownerId: user.id,
      status: ClinicStatus.inactive(),
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
    });

    expect(isRight(result)).toBeTruthy();
    if (isRight(result)) {
      expect(unwrapEither(result).clinic.status.isActive()).toBeTruthy();
    }
  });

  it('should not be able to activate a non existent clinic', async () => {
    const user = makeUser();

    const result = await sut.execute({
      clinicId: 'non-existent-clinic-id',
      userId: user.id.toString(),
    });

    expect(isLeft(result)).toBeTruthy();
    expect(unwrapEither(result)).toBeInstanceOf(ClinicNotFoundError);
  });

  it('should not be able to activate a clinic when user is not the owner', async () => {
    const owner = makeUser();
    const otherUser = makeUser();
    const clinic = makeClinic({
      ownerId: owner.id,
      status: ClinicStatus.inactive(),
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
    });

    expect(isLeft(result)).toBeTruthy();
    expect(unwrapEither(result)).toBeInstanceOf(UserIsNotOwnerError);
  });
});
