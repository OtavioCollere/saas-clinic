import { isLeft, isRight, unwrapEither } from '@/core/either/either';
import { ClinicNotFoundError } from '@/core/errors/clinic-not-found-error';
import { UserIsNotOwnerError } from '@/core/errors/user-is-not-owner-error';
import { ClinicStatus } from '@/domain/enterprise/value-objects/clinic-status';
import { UserRole } from '@/domain/enterprise/value-objects/user-role';
import { makeClinic } from 'tests/factories/makeClinic';
import { makeUser } from 'tests/factories/makeUser';
import { InMemoryClinicRepository } from 'tests/in-memory-repositories/in-memory-clinic-repository';
import { beforeEach, describe, expect, it } from 'vitest';
import { ActivateClinicUseCase } from '../activate-clinic';

describe('ActivateClinicUseCase Unit Tests', () => {
  let sut: ActivateClinicUseCase;
  let inMemoryClinicRepository: InMemoryClinicRepository;

  beforeEach(() => {
    inMemoryClinicRepository = new InMemoryClinicRepository();
    sut = new ActivateClinicUseCase(inMemoryClinicRepository);
  });

  it('should be able to activate a clinic', async () => {
    const owner = makeUser({
      role: UserRole.owner(),
    });
    const clinic = makeClinic({
      ownerId: owner.id,
      status: ClinicStatus.inactive(),
    });
    inMemoryClinicRepository.items.push(clinic);

    const result = await sut.execute({
      clinicId: clinic.id.toString(),
      userId: owner.id.toString(),
    });

    expect(isRight(result)).toBeTruthy();
    if (isRight(result)) {
      expect(unwrapEither(result).clinic.status.isActive()).toBeTruthy();
    }
  });

  it('should not be able to activate a non existent clinic', async () => {
    const owner = makeUser({
      role: UserRole.owner(),
    });

    const result = await sut.execute({
      clinicId: 'non-existent-clinic-id',
      userId: owner.id.toString(),
    });

    expect(isLeft(result)).toBeTruthy();
    expect(unwrapEither(result)).toBeInstanceOf(ClinicNotFoundError);
  });

  it('should not be able to activate a clinic when user is not the owner', async () => {
    const owner = makeUser({
      role: UserRole.owner(),
    });
    const otherUser = makeUser({
      role: UserRole.owner(),
    });
    const clinic = makeClinic({
      ownerId: owner.id,
      status: ClinicStatus.inactive(),
    });
    inMemoryClinicRepository.items.push(clinic);

    const result = await sut.execute({
      clinicId: clinic.id.toString(),
      userId: otherUser.id.toString(),
    });

    expect(isLeft(result)).toBeTruthy();
    expect(unwrapEither(result)).toBeInstanceOf(UserIsNotOwnerError);
  });
});
