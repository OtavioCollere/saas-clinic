import { isLeft, isRight, unwrapEither } from '@/core/either/either';
import { ClinicAlreadyExistsError } from '@/core/errors/clinic-already-exists-error';
import { OwnerNotFoundError } from '@/core/errors/owner-not-found-error';
import { UserIsNotOwnerError } from '@/core/errors/user-is-not-owner-error';
import { Slug } from '@/domain/enterprise/value-objects/slug';
import { UserRole } from '@/domain/enterprise/value-objects/user-role';
import { makeClinic } from 'tests/factories/makeClinic';
import { makeUser } from 'tests/factories/makeUser';
import { InMemoryClinicRepository } from 'tests/in-memory-repositories/in-memory-clinic-repository';
import { InMemoryUsersRepository } from 'tests/in-memory-repositories/in-memory-users-repository';
import { beforeEach, describe, expect, it } from 'vitest';
import { CreateClinicUseCase } from '../create-clinic';

describe('CreateClinicUseCase Unit Tests', () => {
  let sut: CreateClinicUseCase;
  let inMemoryClinicRepository: InMemoryClinicRepository;
  let inMemoryUsersRepository: InMemoryUsersRepository;

  beforeEach(() => {
    inMemoryClinicRepository = new InMemoryClinicRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    sut = new CreateClinicUseCase(inMemoryClinicRepository, inMemoryUsersRepository);
  });

  it('should be able to create a clinic', async () => {
    const owner = makeUser({
      role: UserRole.owner(),
    });
    inMemoryUsersRepository.items.push(owner);

    const result = await sut.execute({
      name: 'Clinic Test',
      ownerId: owner.id.toString(),
      description: 'Test clinic description',
      avatarUrl: 'https://example.com/avatar.png',
    });

    expect(isRight(result)).toBeTruthy();
    if (isRight(result)) {
      expect(unwrapEither(result).clinic.name).toEqual('Clinic Test');
      expect(unwrapEither(result).clinic.description).toEqual('Test clinic description');
      expect(unwrapEither(result).clinic.avatarUrl).toEqual('https://example.com/avatar.png');
    }
  });

  it('should not be able to create a clinic with non existent owner', async () => {
    const result = await sut.execute({
      name: 'Clinic Test',
      ownerId: 'non-existent-owner-id',
    });

    expect(isLeft(result)).toBeTruthy();
    expect(unwrapEither(result)).toBeInstanceOf(OwnerNotFoundError);
  });

  it('should not be able to create a clinic when user is not an owner', async () => {
    const staffUser = makeUser({
      role: UserRole.staff(),
    });
    inMemoryUsersRepository.items.push(staffUser);

    const result = await sut.execute({
      name: 'Clinic Test',
      ownerId: staffUser.id.toString(),
    });

    expect(isLeft(result)).toBeTruthy();
    expect(unwrapEither(result)).toBeInstanceOf(UserIsNotOwnerError);
  });

  it('should not be able to create a clinic with existing slug', async () => {
    const owner = makeUser({
      role: UserRole.owner(),
    });
    inMemoryUsersRepository.items.push(owner);

    const existingClinic = makeClinic({
      name: 'Clinic Test',
      ownerId: owner.id,
      slug: Slug.create('Clinic Test'),
    });
    inMemoryClinicRepository.items.push(existingClinic);

    const result = await sut.execute({
      name: 'Clinic Test',
      ownerId: owner.id.toString(),
    });

    expect(isLeft(result)).toBeTruthy();
    expect(unwrapEither(result)).toBeInstanceOf(ClinicAlreadyExistsError);
  });
});
