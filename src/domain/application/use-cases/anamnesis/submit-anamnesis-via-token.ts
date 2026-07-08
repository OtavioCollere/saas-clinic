import { Inject, Injectable } from '@nestjs/common'
import { type Either, makeLeft, makeRight } from '@/shared/either/either'
import { UniqueEntityId } from '@/shared/entities/unique-entity-id'
import { InvalidAnamnesisTokenError } from '@/shared/errors/invalid-anamnesis-token-error'
import { Anamnesis } from '@/domain/enterprise/entities/anamnesis/anamnesis'
import type { AestheticHistory } from '@/domain/enterprise/entities/anamnesis/aesthetic-history'
import type { HealthConditions } from '@/domain/enterprise/entities/anamnesis/health-conditions'
import type { MedicalHistory } from '@/domain/enterprise/entities/anamnesis/medical-history'
import type { PhysicalAssessment } from '@/domain/enterprise/entities/anamnesis/physical-assessment'
import { AnamnesisRepository } from '../../repositories/anamnesis-repository'
import { AnamnesisTokenRepository } from '../../repositories/anamnesis-token-repository'

interface SubmitAnamnesisViaTokenUseCaseRequest {
  token: string
  aestheticHistory: AestheticHistory
  healthConditions: HealthConditions
  medicalHistory: MedicalHistory
  physicalAssessment: PhysicalAssessment
  patientSignature: string
}

type SubmitAnamnesisViaTokenUseCaseResponse = Either<
  InvalidAnamnesisTokenError,
  Record<string, never>
>

@Injectable()
export class SubmitAnamnesisViaTokenUseCase {
  constructor(
    @Inject(AnamnesisTokenRepository)
    private anamnesisTokenRepository: AnamnesisTokenRepository,
    @Inject(AnamnesisRepository)
    private anamnesisRepository: AnamnesisRepository,
  ) {}

  async execute({
    token,
    aestheticHistory,
    healthConditions,
    medicalHistory,
    physicalAssessment,
    patientSignature,
  }: SubmitAnamnesisViaTokenUseCaseRequest): Promise<SubmitAnamnesisViaTokenUseCaseResponse> {
    const anamnesisToken = await this.anamnesisTokenRepository.findByToken(token)

    if (!anamnesisToken || !anamnesisToken.isActive()) {
      return makeLeft(new InvalidAnamnesisTokenError())
    }

    const anamnesis = Anamnesis.create({
      patientId: new UniqueEntityId(anamnesisToken.patientId.toString()),
      aestheticHistory,
      healthConditions,
      medicalHistory,
      physicalAssessment,
      patientSignature,
    })

    await this.anamnesisRepository.create(anamnesis)

    const usedAt = new Date()
    await this.anamnesisTokenRepository.markAsUsed(anamnesisToken.id.toString(), usedAt)

    return makeRight({})
  }
}
