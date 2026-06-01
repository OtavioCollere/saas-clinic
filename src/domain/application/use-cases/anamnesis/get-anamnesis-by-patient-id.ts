import { Inject, Injectable } from '@nestjs/common';
import { type Either, makeLeft, makeRight } from '@/shared/either/either';
import { PatientNotFoundError } from '@/shared/errors/patient-not-found-error';
import type { Anamnesis } from '@/domain/enterprise/entities/anamnesis/anamnesis';
import { AnamnesisRepository } from '../../repositories/anamnesis-repository';
import { PatientRepository } from '../../repositories/patient-repository';

interface GetAnamnesisByPatientIdUseCaseRequest {
  patientId: string;
}

type GetAnamnesisByPatientIdUseCaseResponse = Either<
  PatientNotFoundError,
  { anamnesis: Anamnesis | null }
>;

@Injectable()
export class GetAnamnesisByPatientIdUseCase {
  constructor(
    @Inject(AnamnesisRepository)
    private anamnesisRepository: AnamnesisRepository,
    @Inject(PatientRepository)
    private patientRepository: PatientRepository,
  ) {}

  async execute({
    patientId,
  }: GetAnamnesisByPatientIdUseCaseRequest): Promise<GetAnamnesisByPatientIdUseCaseResponse> {
    const patient = await this.patientRepository.findById(patientId);

    if (!patient) {
      return makeLeft(new PatientNotFoundError());
    }

    const anamnesis = await this.anamnesisRepository.findByPatientId(patientId);

    return makeRight({ anamnesis });
  }
}
