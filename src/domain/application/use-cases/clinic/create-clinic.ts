import { type Either, makeLeft, makeRight } from '@/shared/either/either';
import { UniqueEntityId } from '@/shared/entities/unique-entity-id';
import { ClinicAlreadyExistsError } from '@/shared/errors/clinic-already-exists-error';
import { OwnerNotFoundError } from '@/shared/errors/owner-not-found-error';
import { Clinic } from '@/domain/enterprise/entities/clinic';
import { ClinicMembership } from '@/domain/enterprise/entities/clinic-membership';
import { ClinicRole } from '@/domain/enterprise/value-objects/clinic-role';
import { Slug } from '@/domain/enterprise/value-objects/slug';
import type { ClinicMembershipRepository } from '../../repositories/clinic-membership-repository';
import type { ClinicRepository } from '../../repositories/clinic-repository';
import type { UsersRepository } from '../../repositories/users-repository';

interface CreateClinicUseCaseRequest {
  name: string;
  ownerId: string;
  description?: string;
  avatarUrl?: string;
}

type CreateClinicUseCaseResponse = Either<
  OwnerNotFoundError | ClinicAlreadyExistsError,
  {
    clinic: Clinic;
  }
>;

export class CreateClinicUseCase {
  constructor(
    private clinicRepository: ClinicRepository,
    private usersRepository: UsersRepository,
    private clinicMembershipRepository: ClinicMembershipRepository
  ) {}

  async execute({ name, ownerId, description, avatarUrl }: CreateClinicUseCaseRequest) {
    const user = await this.usersRepository.findById(ownerId);

    if (!user) {
      return makeLeft(new OwnerNotFoundError());
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

    await this.clinicRepository.create(clinic);

    const membership = ClinicMembership.create({
      userId: new UniqueEntityId(ownerId),
      clinicId: clinic.id,
      role: ClinicRole.owner(),
    });

    await this.clinicMembershipRepository.create(membership);

    return makeRight({
      clinic,
    });
  }
}
