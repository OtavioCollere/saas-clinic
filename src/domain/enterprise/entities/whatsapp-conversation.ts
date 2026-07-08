import { Entity } from '@/shared/entities/entity'
import type { UniqueEntityId } from '@/shared/entities/unique-entity-id'
import type { Optional } from '@/shared/types/optional'
import { ConversationStep } from '../value-objects/conversation-step'

export interface WhatsAppConversationProps {
  phoneNumber: string
  franchiseId: UniqueEntityId
  step: ConversationStep
  patientId?: UniqueEntityId
  professionalId?: UniqueEntityId
  selectedDate?: Date
  expiresAt: Date
  updatedAt?: Date
}

export class WhatsAppConversation extends Entity<WhatsAppConversationProps> {
  static create(
    props: Optional<WhatsAppConversationProps, 'step' | 'expiresAt' | 'updatedAt'>,
    id?: UniqueEntityId,
  ) {
    return new WhatsAppConversation(
      {
        ...props,
        step: props.step ?? ConversationStep.awaitingCpf(),
        expiresAt: props.expiresAt ?? new Date(Date.now() + 30 * 60 * 1000),
      },
      id,
    )
  }

  get phoneNumber() { return this.props.phoneNumber }
  get franchiseId() { return this.props.franchiseId }
  get step() { return this.props.step }
  get patientId() { return this.props.patientId }
  get professionalId() { return this.props.professionalId }
  get selectedDate() { return this.props.selectedDate }
  get expiresAt() { return this.props.expiresAt }
  get updatedAt() { return this.props.updatedAt }

  set step(step: ConversationStep) { this.props.step = step }
  set patientId(patientId: UniqueEntityId | undefined) { this.props.patientId = patientId }
  set professionalId(professionalId: UniqueEntityId | undefined) { this.props.professionalId = professionalId }
  set selectedDate(selectedDate: Date | undefined) { this.props.selectedDate = selectedDate }
  set expiresAt(expiresAt: Date) { this.props.expiresAt = expiresAt }
  set updatedAt(updatedAt: Date | undefined) { this.props.updatedAt = updatedAt }

  refreshExpiry() {
    this.props.expiresAt = new Date(Date.now() + 30 * 60 * 1000)
    this.props.updatedAt = new Date()
  }

  isExpired(): boolean {
    return this.props.expiresAt < new Date()
  }
}
