import { type Either, makeLeft, makeRight } from '@/shared/either/either';
import { ClinicNotFoundError } from '@/shared/errors/clinic-not-found-error';
import { UserIsNotOwnerError } from '@/shared/errors/user-is-not-owner-error';
import type { Clinic } from '@/domain/enterprise/entities/clinic';
import type { ClinicMembershipRepository } from '../../repositories/clinic-membership-repository';
import type { ClinicRepository } from '../../repositories/clinic-repository';

interface ActivateClinicUseCaseRequest {
  clinicId: string;
  userId: string;
}

type ActivateClinicUseCaseResponse = Either<
  ClinicNotFoundError | UserIsNotOwnerError,
  {
    clinic: Clinic;
  }
>;

export class ActivateClinicUseCase {
  constructor(
    private clinicRepository: ClinicRepository,
    private clinicMembershipRepository: ClinicMembershipRepository
  ) {}

  async execute({
    clinicId,
    userId,
  }: ActivateClinicUseCaseRequest): Promise<ActivateClinicUseCaseResponse> {
    const clinic = await this.clinicRepository.findById(clinicId);

    if (!clinic) {
      return makeLeft(new ClinicNotFoundError());
    }

    const clinicMembership = await this.clinicMembershipRepository.findByUserAndClinic(
      userId,
      clinicId
    );

    if (!clinicMembership || !clinicMembership.role.isOwner()) {
      return makeLeft(new UserIsNotOwnerError());
    }

    clinic.status = clinic.status.activate();
    clinic.updatedAt = new Date();

    await this.clinicRepository.update(clinic);

    return makeRight({ clinic });
  }
}
