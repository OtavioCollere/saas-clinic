import { Inject, Injectable } from '@nestjs/common';
import { type Either, makeLeft, makeRight } from '@/shared/either/either';
import { PatientNotFoundError } from '@/shared/errors/patient-not-found-error';
import type { Patient } from '@/domain/enterprise/entities/patient';
import { PatientRepository } from '../../repositories/patient-repository';

interface GetPatientByIdUseCaseRequest {
  patientId: string;
}

type GetPatientByIdUseCaseResponse = Either<
  PatientNotFoundError,
  { patient: Patient }
>;

@Injectable()
export class GetPatientByIdUseCase {
  constructor(
    @Inject(PatientRepository)
    private patientRepository: PatientRepository,
  ) {}

  async execute({
    patientId,
  }: GetPatientByIdUseCaseRequest): Promise<GetPatientByIdUseCaseResponse> {
    const patient = await this.patientRepository.findById(patientId);

    if (!patient) {
      return makeLeft(new PatientNotFoundError());
    }

    return makeRight({ patient });
  }
}
