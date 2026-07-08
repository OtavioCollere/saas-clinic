import type { WhatsAppConversation } from '@/domain/enterprise/entities/whatsapp-conversation'

export abstract class WhatsAppConversationRepository {
  abstract findByPhoneNumberAndFranchiseId(phoneNumber: string, franchiseId: string): Promise<WhatsAppConversation | null>
  abstract save(conversation: WhatsAppConversation): Promise<void>
  abstract delete(phoneNumber: string, franchiseId: string): Promise<void>
}
