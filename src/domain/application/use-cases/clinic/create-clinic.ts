import { type Either, makeLeft, makeRight } from '@/core/either/either';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { ClinicAlreadyExistsError } from '@/core/errors/clinic-already-exists-error';
import { OwnerNotFoundError } from '@/core/errors/owner-not-found-error';
import { UserIsNotOwnerError } from '@/core/errors/user-is-not-owner-error';
import { Clinic } from '@/domain/enterprise/entities/clinic';
import { Slug } from '@/domain/enterprise/value-objects/slug';
import type { ClinicRepository } from '../../repositories/clinic-repository';
import type { UsersRepository } from '../../repositories/users-repository';

interface CreateClinicUseCaseRequest {
  name: string;
  ownerId: string;
  description?: string;
  avatarUrl?: string;
}

type CreateClinicUseCaseResponse = Either<
  OwnerNotFoundError | UserIsNotOwnerError | ClinicAlreadyExistsError,
  {
    clinic: Clinic;
  }
>;

export class CreateClinicUseCase {
  constructor(
    private clinicRepository: ClinicRepository,
    private usersRepository: UsersRepository
  ) {}

  async execute({ name, ownerId, description, avatarUrl }: CreateClinicUseCaseRequest) {
    const user = await this.usersRepository.findById(ownerId);

    if (!user) {
      return makeLeft(new OwnerNotFoundError());
    }

    if (!user.role.isOwner()) {
      return makeLeft(new UserIsNotOwnerError());
    }

    const slug = Slug.create(name);
    const existingClinic = await this.clinicRepository.findBySlug(slug.getValue());

    if (existingClinic) {
      return makeLeft(new ClinicAlreadyExistsError());
    }

    const clinic = Clinic.create({
      name,
      ownerId: new UniqueEntityId(ownerId),
      description,
      avatarUrl,
    });

    return makeRight({
      clinic,
    });
  }
}
