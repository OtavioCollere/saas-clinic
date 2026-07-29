import { Inject, Injectable } from '@nestjs/common'
import { randomUUID } from 'node:crypto'
import { type Either, makeRight } from '@/shared/either/either'
import { InviteToken } from '@/domain/enterprise/entities/invite-token'
import { UniqueEntityId } from '@/shared/entities/unique-entity-id'
import { InviteTokenRepository } from '../../repositories/invite-token-repository'

interface CreateInviteTokenUseCaseRequest {
  createdById: string
  expiresInDays: number
}

type CreateInviteTokenUseCaseResponse = Either<never, { inviteToken: InviteToken }>

@Injectable()
export class CreateInviteTokenUseCase {
  constructor(
    @Inject(InviteTokenRepository)
    private inviteTokenRepository: InviteTokenRepository,
  ) {}

  async execute({ createdById, expiresInDays }: CreateInviteTokenUseCaseRequest): Promise<CreateInviteTokenUseCaseResponse> {
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + expiresInDays)

    const inviteToken = InviteToken.create({
      token: randomUUID(),
      createdById: new UniqueEntityId(createdById),
      expiresAt,
    })

    await this.inviteTokenRepository.create(inviteToken)
    return makeRight({ inviteToken })
  }
}
