import { isLeft, isRight, unwrapEither } from '@/shared/either/either';
import { ClinicAlreadyExistsError } from '@/shared/errors/clinic-already-exists-error';
import { ClinicNotFoundError } from '@/shared/errors/clinic-not-found-error';
import { UserIsNotOwnerError } from '@/shared/errors/user-is-not-owner-error';
import { Slug } from '@/domain/enterprise/value-objects/slug';
import { ClinicRole } from '@/domain/enterprise/value-objects/clinic-role';
import { makeClinic } from 'tests/factories/makeClinic';
import { makeClinicMembership } from 'tests/factories/makeClinicMembership';
import { makeUser } from 'tests/factories/makeUser';
import { InMemoryClinicMembershipRepository } from 'tests/in-memory-repositories/in-memory-clinic-membership-repository';
import { InMemoryClinicRepository } from 'tests/in-memory-repositories/in-memory-clinic-repository';
import { beforeEach, describe, expect, it } from 'vitest';
import { EditClinicUseCase } from '../edit-clinic';

describe('EditClinicUseCase Unit Tests', () => {
  let sut: EditClinicUseCase;
  let inMemoryClinicRepository: InMemoryClinicRepository;
  let inMemoryClinicMembershipRepository: InMemoryClinicMembershipRepository;

  beforeEach(() => {
    inMemoryClinicRepository = new InMemoryClinicRepository();
    inMemoryClinicMembershipRepository = new InMemoryClinicMembershipRepository();
    sut = new EditClinicUseCase(inMemoryClinicRepository, inMemoryClinicMembershipRepository);
  });

  it('should be able to edit a clinic', async () => {
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
      editorId: user.id.toString(),
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
    const user = makeUser();

    const result = await sut.execute({
      clinicId: 'non-existent-clinic-id',
      editorId: user.id.toString(),
      name: 'Updated Clinic Name',
    });

    expect(isLeft(result)).toBeTruthy();
    expect(unwrapEither(result)).toBeInstanceOf(ClinicNotFoundError);
  });

  it('should not be able to edit a clinic when user is not the owner', async () => {
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
      editorId: otherUser.id.toString(),
      name: 'Updated Clinic Name',
    });

    expect(isLeft(result)).toBeTruthy();
    expect(unwrapEither(result)).toBeInstanceOf(UserIsNotOwnerError);
  });

  it('should not be able to edit clinic name to an existing slug', async () => {
    const user = makeUser();
    const clinic = makeClinic({
      name: 'Original Clinic',
      ownerId: user.id,
    });
    const existingClinic = makeClinic({
      name: 'Existing Clinic',
      ownerId: user.id,
      slug: Slug.create('Existing Clinic'),
    });
    const membership = makeClinicMembership({
      userId: user.id,
      clinicId: clinic.id,
      role: ClinicRole.owner(),
    });
    inMemoryClinicRepository.items.push(clinic);
    inMemoryClinicRepository.items.push(existingClinic);
    inMemoryClinicMembershipRepository.items.push(membership);

    const result = await sut.execute({
      clinicId: clinic.id.toString(),
      editorId: user.id.toString(),
      name: 'Existing Clinic',
    });

    expect(isLeft(result)).toBeTruthy();
    expect(unwrapEither(result)).toBeInstanceOf(ClinicAlreadyExistsError);
  });
});
