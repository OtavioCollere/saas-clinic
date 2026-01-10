import { isLeft, isRight, unwrapEither } from '@/core/either/either';
import { ClinicAlreadyExistsError } from '@/core/errors/clinic-already-exists-error';
import { ClinicNotFoundError } from '@/core/errors/clinic-not-found-error';
import { UserIsNotOwnerError } from '@/core/errors/user-is-not-owner-error';
import { Slug } from '@/domain/enterprise/value-objects/slug';
import { UserRole } from '@/domain/enterprise/value-objects/user-role';
import { makeClinic } from 'tests/factories/makeClinic';
import { makeUser } from 'tests/factories/makeUser';
import { InMemoryClinicRepository } from 'tests/in-memory-repositories/in-memory-clinic-repository';
import { beforeEach, describe, expect, it } from 'vitest';
import { EditClinicUseCase } from '../edit-clinic';

describe('EditClinicUseCase Unit Tests', () => {
  let sut: EditClinicUseCase;
  let inMemoryClinicRepository: InMemoryClinicRepository;

  beforeEach(() => {
    inMemoryClinicRepository = new InMemoryClinicRepository();
    sut = new EditClinicUseCase(inMemoryClinicRepository);
  });

  it('should be able to edit a clinic', async () => {
    const owner = makeUser({
      role: UserRole.owner(),
    });
    const clinic = makeClinic({
      ownerId: owner.id,
    });
    inMemoryClinicRepository.items.push(clinic);

    const result = await sut.execute({
      clinicId: clinic.id.toString(),
      editorId: owner.id.toString(),
      name: 'Updated Clinic Name',
      description: 'Updated description',
      avatarUrl: 'https://example.com/updated-avatar.png',
    });

    expect(isRight(result)).toBeTruthy();
    if (isRight(result)) {
      expect(unwrapEither(result).clinic.name).toEqual('Updated Clinic Name');
      expect(unwrapEither(result).clinic.description).toEqual('Updated description');
      expect(unwrapEither(result).clinic.avatarUrl).toEqual(
        'https://example.com/updated-avatar.png'
      );
    }
  });

  it('should not be able to edit a non existent clinic', async () => {
    const owner = makeUser({
      role: UserRole.owner(),
    });

    const result = await sut.execute({
      clinicId: 'non-existent-clinic-id',
      editorId: owner.id.toString(),
      name: 'Updated Clinic Name',
    });

    expect(isLeft(result)).toBeTruthy();
    expect(unwrapEither(result)).toBeInstanceOf(ClinicNotFoundError);
  });

  it('should not be able to edit a clinic when user is not the owner', async () => {
    const owner = makeUser({
      role: UserRole.owner(),
    });
    const otherUser = makeUser({
      role: UserRole.owner(),
    });
    const clinic = makeClinic({
      ownerId: owner.id,
    });
    inMemoryClinicRepository.items.push(clinic);

    const result = await sut.execute({
      clinicId: clinic.id.toString(),
      editorId: otherUser.id.toString(),
      name: 'Updated Clinic Name',
    });

    expect(isLeft(result)).toBeTruthy();
    expect(unwrapEither(result)).toBeInstanceOf(UserIsNotOwnerError);
  });

  it('should not be able to edit clinic name to an existing slug', async () => {
    const owner = makeUser({
      role: UserRole.owner(),
    });
    const clinic = makeClinic({
      name: 'Original Clinic',
      ownerId: owner.id,
    });
    const existingClinic = makeClinic({
      name: 'Existing Clinic',
      ownerId: owner.id,
      slug: Slug.create('Existing Clinic'),
    });
    inMemoryClinicRepository.items.push(clinic);
    inMemoryClinicRepository.items.push(existingClinic);

    const result = await sut.execute({
      clinicId: clinic.id.toString(),
      editorId: owner.id.toString(),
      name: 'Existing Clinic',
    });

    expect(isLeft(result)).toBeTruthy();
    expect(unwrapEither(result)).toBeInstanceOf(ClinicAlreadyExistsError);
  });
});
