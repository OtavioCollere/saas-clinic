import { Inject, Injectable } from '@nestjs/common';
import { type Either, makeLeft, makeRight } from '@/shared/either/either';
import { PatientNotFoundError } from '@/shared/errors/patient-not-found-error';
import type { Patient } from '@/domain/enterprise/entities/patient';
import { PatientRepository } from '../../repositories/patient-repository';
import { ClinicRepository } from '../../repositories/clinic-repository';
import { ClinicNotFoundError } from '@/shared/errors/clinic-not-found-error';

interface GetPatientByUserIdUseCaseRequest {
  userId: string;
  clinicSlug: string;
}

type GetPatientByUserIdUseCaseResponse = Either<
  PatientNotFoundError | ClinicNotFoundError,
  { patient: Patient }
>;

@Injectable()
export class GetPatientByUserIdUseCase {
  constructor(
    @Inject(PatientRepository)
    private patientRepository: PatientRepository,
    @Inject(ClinicRepository)
    private clinicRepository: ClinicRepository,
  ) {}

  async execute({
    userId,
    clinicSlug,
  }: GetPatientByUserIdUseCaseRequest): Promise<GetPatientByUserIdUseCaseResponse> {
    const clinic = await this.clinicRepository.findBySlug(clinicSlug);

    if (!clinic) {
      return makeLeft(new ClinicNotFoundError());
    }

    const patient = await this.patientRepository.findByUserIdAndClinicId(
      userId,
      clinic.id.toString(),
    );

    if (!patient) {
      return makeLeft(new PatientNotFoundError());
    }

    return makeRight({ patient });
  }
}
