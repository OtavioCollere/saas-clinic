import { isLeft, isRight, unwrapEither } from '@/shared/either/either';
import { ClinicAlreadyExistsError } from '@/shared/errors/clinic-already-exists-error';
import { OwnerNotFoundError } from '@/shared/errors/owner-not-found-error';
import { Slug } from '@/domain/enterprise/value-objects/slug';
import { ClinicRole } from '@/domain/enterprise/value-objects/clinic-role';
import { makeClinic } from 'tests/factories/makeClinic';
import { makeClinicMembership } from 'tests/factories/makeClinicMembership';
import { makeUser } from 'tests/factories/makeUser';
import { InMemoryClinicMembershipRepository } from 'tests/in-memory-repositories/in-memory-clinic-membership-repository';
import { InMemoryClinicRepository } from 'tests/in-memory-repositories/in-memory-clinic-repository';
import { InMemoryUsersRepository } from 'tests/in-memory-repositories/in-memory-users-repository';
import { beforeEach, describe, expect, it } from 'vitest';
import { CreateClinicUseCase } from '../create-clinic';

describe('CreateClinicUseCase Unit Tests', () => {
  let sut: CreateClinicUseCase;
  let inMemoryClinicRepository: InMemoryClinicRepository;
  let inMemoryUsersRepository: InMemoryUsersRepository;
  let inMemoryClinicMembershipRepository: InMemoryClinicMembershipRepository;

  beforeEach(() => {
    inMemoryClinicRepository = new InMemoryClinicRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryClinicMembershipRepository = new InMemoryClinicMembershipRepository();
    sut = new CreateClinicUseCase(
      inMemoryClinicRepository,
      inMemoryUsersRepository,
      inMemoryClinicMembershipRepository
    );
  });

  it('should be able to create a clinic', async () => {
    const user = makeUser();
    inMemoryUsersRepository.items.push(user);

    const result = await sut.execute({
      name: 'Clinic Test',
      ownerId: user.id.toString(),
      description: 'Test clinic description',
      avatarUrl: 'https://example.com/avatar.png',
    });

    expect(isRight(result)).toBeTruthy();
    if (isRight(result)) {
      expect(unwrapEither(result).clinic.name).toEqual('Clinic Test');
      expect(unwrapEither(result).clinic.description).toEqual('Test clinic description');
      expect(unwrapEither(result).clinic.avatarUrl).toEqual('https://example.com/avatar.png');
      expect(inMemoryClinicMembershipRepository.items).toHaveLength(1);
      expect(inMemoryClinicMembershipRepository.items[0].userId.toString()).toEqual(user.id.toString());
      expect(inMemoryClinicMembershipRepository.items[0].clinicId.toString()).toEqual(
        unwrapEither(result).clinic.id.toString()
      );
      expect(inMemoryClinicMembershipRepository.items[0].role.isOwner()).toBeTruthy();
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

  it('should not be able to create a clinic with existing slug', async () => {
    const user = makeUser();
    inMemoryUsersRepository.items.push(user);

    const existingClinic = makeClinic({
      name: 'Clinic Test',
      ownerId: user.id,
      slug: Slug.create('Clinic Test'),
    });
    inMemoryClinicRepository.items.push(existingClinic);

    const result = await sut.execute({
      name: 'Clinic Test',
      ownerId: user.id.toString(),
    });

    expect(isLeft(result)).toBeTruthy();
    expect(unwrapEither(result)).toBeInstanceOf(ClinicAlreadyExistsError);
  });
});
