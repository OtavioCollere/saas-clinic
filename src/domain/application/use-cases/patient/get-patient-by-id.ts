import { type Either, makeLeft, makeRight } from '@/core/either/either';
import { PatientNotFoundError } from '@/core/errors/patient-not-found-error';
import type { Patient } from '@/domain/enterprise/entities/patient';
import type { PatientRepository } from '../../repositories/patient-repository';

interface GetPatientByIdUseCaseRequest {
  patientId: string;
}

type GetPatientByIdUseCaseResponse = Either<
  PatientNotFoundError,
  { patient: Patient }
>;

export class GetPatientByIdUseCase {
  constructor(private patientRepository: PatientRepository) {}

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
