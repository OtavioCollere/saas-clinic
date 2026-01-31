import { type Either, makeLeft, makeRight } from '@/shared/either/either';
import { ClinicNotFoundError } from '@/shared/errors/clinic-not-found-error';
import type { Clinic } from '@/domain/enterprise/entities/clinic';
import type { ClinicRepository } from '../../repositories/clinic-repository';

interface GetClinicByIdUseCaseRequest {
  clinicId: string;
}

type GetClinicByIdUseCaseResponse = Either<ClinicNotFoundError, { clinic: Clinic }>;

export class GetClinicByIdUseCase {
  constructor(private clinicRepository: ClinicRepository) {}

  async execute({ clinicId }: GetClinicByIdUseCaseRequest): Promise<GetClinicByIdUseCaseResponse> {
    const clinic = await this.clinicRepository.findById(clinicId);

    if (!clinic) {
      return makeLeft(new ClinicNotFoundError());
    }

    return makeRight({ clinic });
  }
}
