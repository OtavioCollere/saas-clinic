import { Inject, Injectable } from '@nestjs/common'
import { type Either, makeRight } from '@/shared/either/either'
import { InviteToken } from '@/domain/enterprise/entities/invite-token'
import { InviteTokenRepository } from '../../repositories/invite-token-repository'

type ListInviteTokensUseCaseResponse = Either<never, { tokens: InviteToken[] }>

@Injectable()
export class ListInviteTokensUseCase {
  constructor(
    @Inject(InviteTokenRepository)
    private inviteTokenRepository: InviteTokenRepository,
  ) {}

  async execute(): Promise<ListInviteTokensUseCaseResponse> {
    const tokens = await this.inviteTokenRepository.listAll()
    return makeRight({ tokens })
  }
}
