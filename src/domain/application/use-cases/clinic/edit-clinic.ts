import { type Either, makeLeft, makeRight } from '@/core/either/either';
import { ClinicAlreadyExistsError } from '@/core/errors/clinic-already-exists-error';
import { ClinicNotFoundError } from '@/core/errors/clinic-not-found-error';
import { UserIsNotOwnerError } from '@/core/errors/user-is-not-owner-error';
import type { Clinic } from '@/domain/enterprise/entities/clinic';
import { Slug } from '@/domain/enterprise/value-objects/slug';
import type { ClinicMembershipRepository } from '../../repositories/clinic-membership-repository';
import type { ClinicRepository } from '../../repositories/clinic-repository';

interface EditClinicUseCaseRequest {
  editorId: string;
  clinicId: string;
  name?: string;
  description?: string;
  avatarUrl?: string;
}

type EditClinicUseCaseResponse = Either<
  UserIsNotOwnerError | ClinicNotFoundError | ClinicAlreadyExistsError,
  {
    clinic: Clinic;
  }
>;

export class EditClinicUseCase {
  constructor(
    private clinicRepository: ClinicRepository,
    private clinicMembershipRepository: ClinicMembershipRepository
  ) {}

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

    const clinicMembership = await this.clinicMembershipRepository.findByUserAndClinic(
      editorId,
      clinicId
    );

    if (!clinicMembership || !clinicMembership.role.isOwner()) {
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

    clinic.updatedAt = new Date();

    await this.clinicRepository.update(clinic);

    return makeRight({ clinic });
  }
}
