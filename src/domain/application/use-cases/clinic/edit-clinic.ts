import { type Either, makeLeft, makeRight } from '@/core/either/either';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { ClinicAlreadyExistsError } from '@/core/errors/clinic-already-exists-error';
import { ClinicNotFoundError } from '@/core/errors/clinic-not-found-error';
import { OwnerNotFoundError } from '@/core/errors/owner-not-found-error';
import { UserIsNotOwnerError } from '@/core/errors/user-is-not-owner-error';
import type { UserNotFoundError } from '@/core/errors/user-not-found-error';
import type { Clinic } from '@/domain/enterprise/entities/clinic';
import { Slug } from '@/domain/enterprise/value-objects/slug';
import type { ClinicRepository } from '../../repositories/clinic-repository';
import type { UsersRepository } from '../../repositories/users-repository';

interface EditClinicUseCaseRequest {
  editorId: string;
  clinicId: string;
  name?: string;
  description?: string;
  avatarUrl?: string;
}

type EditClinicUseCaseResponse = Either<
  UserIsNotOwnerError | UserNotFoundError | ClinicNotFoundError | ClinicAlreadyExistsError,
  {
    clinic: Clinic;
  }
>;

export class EditClinicUseCase {
  constructor(private clinicRepository: ClinicRepository) {}

  async execute({
    clinicId,
    editorId,
    name,
    description,
    avatarUrl,
  }: EditClinicUseCaseRequest): Promise<EditClinicUseCaseResponse> {
    const clinic = await this.clinicRepository.findById(clinicId);

    if (!clinic) {
      return makeLeft(new ClinicNotFoundError());
    }

    if (clinic.ownerId.toString() !== editorId) {
      return makeLeft(new UserIsNotOwnerError());
    }

    if (name) {
      const slug = Slug.create(name);

      const existingClinic = await this.clinicRepository.findBySlug(slug.getValue());

      if (existingClinic && existingClinic.id !== clinic.id) {
        return makeLeft(new ClinicAlreadyExistsError());
      }

      clinic.name = name;
      clinic.slug = slug;
    }

    if (description) clinic.description = description;
    if (avatarUrl) clinic.avatarUrl = avatarUrl;

    await this.clinicRepository.update(clinic);

    return makeRight({ clinic });
  }
}
