import { type Either, makeLeft, makeRight } from '@/core/either/either';
import { ClinicNotFoundError } from '@/core/errors/clinic-not-found-error';
import { UserIsNotOwnerError } from '@/core/errors/user-is-not-owner-error';
import type { Clinic } from '@/domain/enterprise/entities/clinic';
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
  constructor(private clinicRepository: ClinicRepository) {}

  async execute({
    clinicId,
    userId,
  }: ActivateClinicUseCaseRequest): Promise<ActivateClinicUseCaseResponse> {
    const clinic = await this.clinicRepository.findById(clinicId);

    if (!clinic) {
      return makeLeft(new ClinicNotFoundError());
    }

    if (clinic.ownerId.toString() !== userId) {
      return makeLeft(new UserIsNotOwnerError());
    }

    clinic.status = clinic.status.activate();
    clinic.updatedAt = new Date();

    await this.clinicRepository.update(clinic);

    return makeRight({ clinic });
  }
}
