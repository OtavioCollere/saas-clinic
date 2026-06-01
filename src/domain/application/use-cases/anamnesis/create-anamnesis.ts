import { Inject, Injectable } from '@nestjs/common';
import { type Either, makeLeft, makeRight } from '@/shared/either/either';
import { UniqueEntityId } from '@/shared/entities/unique-entity-id';
import { PatientNotFoundError } from '@/shared/errors/patient-not-found-error';
import type { Anamnesis } from '@/domain/enterprise/entities/anamnesis/anamnesis';
import type { AestheticHistory } from '@/domain/enterprise/entities/anamnesis/aesthetic-history';
import type { HealthConditions } from '@/domain/enterprise/entities/anamnesis/health-conditions';
import type { MedicalHistory } from '@/domain/enterprise/entities/anamnesis/medical-history';
import type { PhysicalAssessment } from '@/domain/enterprise/entities/anamnesis/physical-assessment';
import { Anamnesis as AnamnesisEntity } from '@/domain/enterprise/entities/anamnesis/anamnesis';
import { AnamnesisRepository } from '../../repositories/anamnesis-repository';
import { PatientRepository } from '../../repositories/patient-repository';

interface CreateAnamnesisUseCaseRequest {
  patientId: string;
  aestheticHistory: AestheticHistory;
  healthConditions: HealthConditions;
  medicalHistory: MedicalHistory;
  physicalAssessment: PhysicalAssessment;
  patientSignature: string;
}

type CreateAnamnesisUseCaseResponse = Either<
  PatientNotFoundError,
  {
    anamnesis: Anamnesis;
  }
>;

@Injectable()
export class CreateAnamnesisUseCase {
  constructor(
    @Inject(AnamnesisRepository)
    private anamnesisRepository: AnamnesisRepository,
    @Inject(PatientRepository)
    private patientRepository: PatientRepository
  ) {}

  async execute({
    patientId,
    aestheticHistory,
    healthConditions,
    medicalHistory,
    physicalAssessment,
    patientSignature,
  }: CreateAnamnesisUseCaseRequest): Promise<CreateAnamnesisUseCaseResponse> {
    const patient = await this.patientRepository.findById(patientId);

    if (!patient) {
      return makeLeft(new PatientNotFoundError());
    }

    const anamnesis = AnamnesisEntity.create({
      patientId: new UniqueEntityId(patientId),
      aestheticHistory,
      healthConditions,
      medicalHistory,
      physicalAssessment,
      patientSignature,
    });

    await this.anamnesisRepository.create(anamnesis);

    return makeRight({ anamnesis });
  }
}
