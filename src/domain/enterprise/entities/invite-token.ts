import { Entity } from '@/shared/entities/entity'
import type { UniqueEntityId } from '@/shared/entities/unique-entity-id'
import type { Optional } from '@/shared/types/optional'

export type InviteTokenStatus = 'PENDING' | 'USED' | 'EXPIRED' | 'REVOKED'

export interface InviteTokenProps {
  token: string
  createdById: UniqueEntityId
  usedById?: UniqueEntityId
  status: InviteTokenStatus
  expiresAt: Date
  createdAt: Date
  usedAt?: Date
}

export class InviteToken extends Entity<InviteTokenProps> {
  static create(
    props: Optional<InviteTokenProps, 'createdAt' | 'status' | 'usedAt' | 'usedById'>,
    id?: UniqueEntityId,
  ) {
    return new InviteToken(
      {
        ...props,
        status: props.status ?? 'PENDING',
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )
  }

  get token() { return this.props.token }
  get createdById() { return this.props.createdById }
  get usedById() { return this.props.usedById }
  get status() { return this.props.status }
  get expiresAt() { return this.props.expiresAt }
  get usedAt() { return this.props.usedAt }
  get createdAt() { return this.props.createdAt }

  isExpired(): boolean {
    return this.props.expiresAt < new Date()
  }

  isActive(): boolean {
    return this.props.status === 'PENDING' && !this.isExpired()
  }

  markAsUsed(usedById: UniqueEntityId) {
    this.props.status = 'USED'
    this.props.usedById = usedById
    this.props.usedAt = new Date()
  }

  revoke() {
    this.props.status = 'REVOKED'
  }
}
