import { Entity } from '@/shared/entities/entity'
import type { UniqueEntityId } from '@/shared/entities/unique-entity-id'
import type { Optional } from '@/shared/types/optional'

export type AnamnesisTokenStatus = 'PENDING' | 'USED' | 'EXPIRED' | 'INVALIDATED'

export interface AnamnesisTokenProps {
  patientId: UniqueEntityId
  clinicId: UniqueEntityId
  token: string
  status: AnamnesisTokenStatus
  expiresAt: Date
  usedAt?: Date
  createdAt: Date
  updatedAt?: Date
}

export class AnamnesisToken extends Entity<AnamnesisTokenProps> {
  static create(
    props: Optional<AnamnesisTokenProps, 'createdAt' | 'status' | 'updatedAt' | 'usedAt'>,
    id?: UniqueEntityId,
  ) {
    return new AnamnesisToken(
      {
        ...props,
        status: props.status ?? 'PENDING',
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )
  }

  get patientId() { return this.props.patientId }
  get clinicId() { return this.props.clinicId }
  get token() { return this.props.token }
  get status() { return this.props.status }
  get expiresAt() { return this.props.expiresAt }
  get usedAt(): Date | undefined { return this.props.usedAt }
  get createdAt() { return this.props.createdAt }
  get updatedAt(): Date | undefined { return this.props.updatedAt }

  isExpired(): boolean {
    return this.props.expiresAt < new Date()
  }

  isActive(): boolean {
    return this.props.status === 'PENDING' && !this.isExpired()
  }

  markAsUsed() {
    this.props.status = 'USED'
    this.props.usedAt = new Date()
    this.props.updatedAt = new Date()
  }

  invalidate() {
    this.props.status = 'INVALIDATED'
    this.props.updatedAt = new Date()
  }
}
