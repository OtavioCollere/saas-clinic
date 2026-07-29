import { Inject, Injectable } from '@nestjs/common'
import { type Either, makeLeft, makeRight } from '@/shared/either/either'
import { InviteTokenRepository } from '../../repositories/invite-token-repository'

export class TokenNotRevokableError extends Error {
  constructor() {
    super('Token já foi utilizado, expirado ou revogado.')
  }
}

interface RevokeInviteTokenUseCaseRequest {
  tokenId: string
}

type RevokeInviteTokenUseCaseResponse = Either<TokenNotRevokableError, { success: true }>

@Injectable()
export class RevokeInviteTokenUseCase {
  constructor(
    @Inject(InviteTokenRepository)
    private inviteTokenRepository: InviteTokenRepository,
  ) {}

  async execute({ tokenId }: RevokeInviteTokenUseCaseRequest): Promise<RevokeInviteTokenUseCaseResponse> {
    const inviteToken = await this.inviteTokenRepository.findById(tokenId)

    if (!inviteToken || inviteToken.status !== 'PENDING') {
      return makeLeft(new TokenNotRevokableError())
    }

    inviteToken.revoke()
    await this.inviteTokenRepository.save(inviteToken)

    return makeRight({ success: true })
  }
}
