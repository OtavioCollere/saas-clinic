import { Inject, Injectable } from '@nestjs/common';
import { type Either, makeLeft, makeRight } from '@/shared/either/either';
import { ClinicNotFoundError } from '@/shared/errors/clinic-not-found-error';
import { ClinicRepository } from '../../repositories/clinic-repository';
import { PatientRepository, type PatientWithUserData } from '../../repositories/patient-repository';
import type { PaginationParams } from '@/shared/types/pagination-params';

interface FetchPatientsByClinicIdUseCaseRequest {
  clinicId: string;
  page: number;
  pageSize?: number;
  query?: string;
}

type FetchPatientsByClinicIdUseCaseResponse = Either<
  ClinicNotFoundError,
  {
    patients: PatientWithUserData[];
  }
>;

@Injectable()
export class FetchPatientsByClinicIdUseCase {
  constructor(
    @Inject(PatientRepository)
    private patientRepository: PatientRepository,
    @Inject(ClinicRepository)
    private clinicRepository: ClinicRepository,
  ) {}

  async execute({
    clinicId,
    page,
    pageSize = 20,
    query,
  }: FetchPatientsByClinicIdUseCaseRequest): Promise<FetchPatientsByClinicIdUseCaseResponse> {
    const clinic = await this.clinicRepository.findById(clinicId);

    if (!clinic) {
      return makeLeft(new ClinicNotFoundError());
    }

    const patients = await this.patientRepository.fetchByClinicId(clinicId, {
      page,
      pageSize,
      query,
    });

    return makeRight({ patients });
  }
}


