import { Inject, Injectable } from '@nestjs/common'
import { type Either, makeLeft, makeRight } from '@/shared/either/either'
import { InviteTokenRepository } from '../../repositories/invite-token-repository'

export type InviteTokenErrorCode = 'NOT_FOUND' | 'EXPIRED' | 'ALREADY_USED' | 'REVOKED'

export class InvalidInviteTokenError extends Error {
  readonly code: InviteTokenErrorCode
  constructor(code: InviteTokenErrorCode = 'NOT_FOUND') {
    super('Invite token inválido ou expirado')
    this.code = code
  }
}

interface ValidateInviteTokenUseCaseRequest {
  token: string
}

type ValidateInviteTokenUseCaseResponse = Either<InvalidInviteTokenError, { expiresAt: Date }>

@Injectable()
export class ValidateInviteTokenUseCase {
  constructor(
    @Inject(InviteTokenRepository)
    private inviteTokenRepository: InviteTokenRepository,
  ) {}

  async execute({ token }: ValidateInviteTokenUseCaseRequest): Promise<ValidateInviteTokenUseCaseResponse> {
    const inviteToken = await this.inviteTokenRepository.findByToken(token)

    if (!inviteToken) return makeLeft(new InvalidInviteTokenError('NOT_FOUND'))
    if (inviteToken.status === 'USED') return makeLeft(new InvalidInviteTokenError('ALREADY_USED'))
    if (inviteToken.status === 'REVOKED') return makeLeft(new InvalidInviteTokenError('REVOKED'))
    if (inviteToken.isExpired()) return makeLeft(new InvalidInviteTokenError('EXPIRED'))

    return makeRight({ expiresAt: inviteToken.expiresAt })
  }
}
