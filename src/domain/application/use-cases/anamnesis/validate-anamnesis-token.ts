import { Inject, Injectable } from '@nestjs/common'
import { type Either, makeLeft, makeRight } from '@/shared/either/either'
import { InvalidAnamnesisTokenError } from '@/shared/errors/invalid-anamnesis-token-error'
import { AnamnesisTokenRepository } from '../../repositories/anamnesis-token-repository'
import { PatientRepository } from '../../repositories/patient-repository'

interface ValidateAnamnesisTokenUseCaseRequest {
  token: string
}

type ValidateAnamnesisTokenUseCaseResponse = Either<
  InvalidAnamnesisTokenError,
  {
    patientId: string
    patientName: string
    expiresAt: Date
  }
>

@Injectable()
export class ValidateAnamnesisTokenUseCase {
  constructor(
    @Inject(AnamnesisTokenRepository)
    private anamnesisTokenRepository: AnamnesisTokenRepository,
    @Inject(PatientRepository)
    private patientRepository: PatientRepository,
  ) {}

  async execute({
    token,
  }: ValidateAnamnesisTokenUseCaseRequest): Promise<ValidateAnamnesisTokenUseCaseResponse> {
    const anamnesisToken = await this.anamnesisTokenRepository.findByToken(token)

    if (!anamnesisToken) {
      return makeLeft(new InvalidAnamnesisTokenError('NOT_FOUND'))
    }

    if (!anamnesisToken.isActive()) {
      if (anamnesisToken.isExpired()) {
        return makeLeft(new InvalidAnamnesisTokenError('EXPIRED'))
      }
      if (anamnesisToken.status === 'USED') {
        return makeLeft(new InvalidAnamnesisTokenError('ALREADY_USED'))
      }
      return makeLeft(new InvalidAnamnesisTokenError('INVALIDATED'))
    }

    const patient = await this.patientRepository.findById(
      anamnesisToken.patientId.toString(),
    )

    if (!patient) {
      return makeLeft(new InvalidAnamnesisTokenError())
    }

    return makeRight({
      patientId: anamnesisToken.patientId.toString(),
      patientName: patient.name,
      expiresAt: anamnesisToken.expiresAt,
    })
  }
}
