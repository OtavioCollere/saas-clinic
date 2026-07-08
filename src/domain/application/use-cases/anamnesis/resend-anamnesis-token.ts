import { Inject, Injectable } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { type Either, makeLeft, makeRight } from '@/shared/either/either'
import { PatientNotFoundError } from '@/shared/errors/patient-not-found-error'
import { AnamnesisTokenRequestedEvent } from '@/domain/enterprise/events/anamnesis-token-requested.event'
import { PatientRepository } from '../../repositories/patient-repository'
import { UsersRepository } from '../../repositories/users-repository'

interface ResendAnamnesisTokenUseCaseRequest {
  patientId: string
}

type ResendAnamnesisTokenUseCaseResponse = Either<PatientNotFoundError, Record<string, never>>

@Injectable()
export class ResendAnamnesisTokenUseCase {
  constructor(
    @Inject(PatientRepository)
    private patientRepository: PatientRepository,
    @Inject(UsersRepository)
    private usersRepository: UsersRepository,
    @Inject(EventEmitter2)
    private eventEmitter: EventEmitter2,
  ) {}

  async execute({
    patientId,
  }: ResendAnamnesisTokenUseCaseRequest): Promise<ResendAnamnesisTokenUseCaseResponse> {
    const patient = await this.patientRepository.findById(patientId)

    if (!patient) {
      return makeLeft(new PatientNotFoundError())
    }

    const user = await this.usersRepository.findById(patient.userId.toString())

    if (!user) {
      return makeLeft(new PatientNotFoundError())
    }

    this.eventEmitter.emit(
      'anamnesis.token.requested',
      new AnamnesisTokenRequestedEvent(
        patient.id.toString(),
        patient.clinicId.toString(),
        user.email.getValue(),
        patient.phone,
        patient.name,
      ),
    )

    return makeRight({})
  }
}
