import { WhatsAppConversation } from '@/domain/enterprise/entities/whatsapp-conversation'
import { ConversationStep } from '@/domain/enterprise/value-objects/conversation-step'
import { UniqueEntityId } from '@/shared/entities/unique-entity-id'

type WhatsAppConversationRaw = {
  id: string
  phoneNumber: string
  franchiseId: string
  step: string
  patientId: string | null
  professionalId: string | null
  selectedDate: Date | null
  expiresAt: Date
  updatedAt: Date | null
}

export class WhatsAppConversationMapper {
  static toDomain(raw: WhatsAppConversationRaw): WhatsAppConversation {
    return WhatsAppConversation.create(
      {
        phoneNumber: raw.phoneNumber,
        franchiseId: new UniqueEntityId(raw.franchiseId),
        step: ConversationStep.fromValue(raw.step),
        patientId: raw.patientId ? new UniqueEntityId(raw.patientId) : undefined,
        professionalId: raw.professionalId ? new UniqueEntityId(raw.professionalId) : undefined,
        selectedDate: raw.selectedDate ?? undefined,
        expiresAt: raw.expiresAt,
        updatedAt: raw.updatedAt ?? undefined,
      },
      new UniqueEntityId(raw.id),
    )
  }

  static toPrisma(conversation: WhatsAppConversation) {
    return {
      id: conversation.id.toString(),
      phoneNumber: conversation.phoneNumber,
      franchiseId: conversation.franchiseId.toString(),
      step: conversation.step.getValue(),
      patientId: conversation.patientId?.toString() ?? null,
      professionalId: conversation.professionalId?.toString() ?? null,
      selectedDate: conversation.selectedDate ?? null,
      expiresAt: conversation.expiresAt,
      updatedAt: conversation.updatedAt ?? new Date(),
    }
  }
}
