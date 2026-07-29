import type { InviteToken } from '@/domain/enterprise/entities/invite-token'

export abstract class InviteTokenRepository {
  abstract create(token: InviteToken): Promise<void>
  abstract findByToken(token: string): Promise<InviteToken | null>
  abstract findById(id: string): Promise<InviteToken | null>
  abstract listAll(): Promise<InviteToken[]>
  abstract save(token: InviteToken): Promise<void>
}
