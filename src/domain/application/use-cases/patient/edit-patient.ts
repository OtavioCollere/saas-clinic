import { type Either, makeLeft, makeRight } from '@/core/either/either';
import { PatientNotFoundError } from '@/core/errors/patient-not-found-error';
import type { Patient } from '@/domain/enterprise/entities/patient';
import type { PatientRepository } from '../../repositories/patient-repository';

interface EditPatientUseCaseRequest {
  patientId: string;
  name?: string;
  birthDay?: Date;
  address?: string;
  zipCode?: string;
}

type EditPatientUseCaseResponse = Either<
  PatientNotFoundError,
  {
    patient: Patient;
  }
>;

export class EditPatientUseCase {
  constructor(private patientRepository: PatientRepository) {}

  async execute({
    patientId,
    name,
    birthDay,
    address,
    zipCode,
  }: EditPatientUseCaseRequest): Promise<EditPatientUseCaseResponse> {
    const patient = await this.patientRepository.findById(patientId);

    if (!patient) {
      return makeLeft(new PatientNotFoundError());
    }

    if (name) {
      patient.name = name;
    }

    if (birthDay) {
      patient.birthDay = birthDay;
    }

    if (address) {
      patient.address = address;
    }

    if (zipCode) {
      patient.zipCode = zipCode;
    }

    patient.updatedAt = new Date();

    await this.patientRepository.update(patient);

    return makeRight({ patient });
  }
}
