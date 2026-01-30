import { type Either, makeLeft, makeRight } from '@/core/either/either';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { PatientNotFoundError } from '@/core/errors/patient-not-found-error';
import type { Anamnesis } from '@/domain/enterprise/entities/anamnesis/anamnesis';
import type { AestheticHistory } from '@/domain/enterprise/entities/anamnesis/aesthetic-history';
import type { HealthConditions } from '@/domain/enterprise/entities/anamnesis/health-conditions';
import type { MedicalHistory } from '@/domain/enterprise/entities/anamnesis/medical-history';
import type { PhysicalAssessment } from '@/domain/enterprise/entities/anamnesis/physical-assessment';
import { Anamnesis as AnamnesisEntity } from '@/domain/enterprise/entities/anamnesis/anamnesis';
import type { AnamnesisRepository } from '../../repositories/anamnesis-repository';
import type { PatientRepository } from '../../repositories/patient-repository';

interface CreateAnamnesisUseCaseRequest {
  patientId: string;
  aestheticHistory: AestheticHistory;
  healthConditions: HealthConditions;
  medicalHistory: MedicalHistory;
  physicalAssessment: PhysicalAssessment;
}

type CreateAnamnesisUseCaseResponse = Either<
  PatientNotFoundError,
  {
    anamnesis: Anamnesis;
  }
>;

export class CreateAnamnesisUseCase {
  constructor(
    private anamnesisRepository: AnamnesisRepository,
    private patientRepository: PatientRepository
  ) {}

  async execute({
    patientId,
    aestheticHistory,
    healthConditions,
    medicalHistory,
    physicalAssessment,
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
    });

    await this.anamnesisRepository.create(anamnesis);

    return makeRight({ anamnesis });
  }
}
