import { Inject, Injectable } from '@nestjs/common'
import { randomUUID } from 'crypto'
import { type Either, makeRight } from '@/shared/either/either'
import { UniqueEntityId } from '@/shared/entities/unique-entity-id'
import { AnamnesisToken } from '@/domain/enterprise/entities/anamnesis-token'
import { AnamnesisTokenRepository } from '../../repositories/anamnesis-token-repository'

interface RequestAnamnesisTokenUseCaseRequest {
  patientId: string
  clinicId: string
}

type RequestAnamnesisTokenUseCaseResponse = Either<
  never,
  { token: AnamnesisToken }
>

@Injectable()
export class RequestAnamnesisTokenUseCase {
  constructor(
    @Inject(AnamnesisTokenRepository)
    private anamnesisTokenRepository: AnamnesisTokenRepository,
  ) {}

  async execute({
    patientId,
    clinicId,
  }: RequestAnamnesisTokenUseCaseRequest): Promise<RequestAnamnesisTokenUseCaseResponse> {
    await this.anamnesisTokenRepository.invalidateAllPendingForPatient(patientId)

    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7)

    const token = AnamnesisToken.create({
      patientId: new UniqueEntityId(patientId),
      clinicId: new UniqueEntityId(clinicId),
      token: randomUUID(),
      expiresAt,
    })

    await this.anamnesisTokenRepository.create(token)

    return makeRight({ token })
  }
}
