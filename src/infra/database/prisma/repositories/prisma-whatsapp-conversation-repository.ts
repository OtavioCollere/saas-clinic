import { Inject, Injectable } from '@nestjs/common'
import { WhatsAppConversationRepository } from '@/domain/application/repositories/whatsapp-conversation-repository'
import { WhatsAppConversation } from '@/domain/enterprise/entities/whatsapp-conversation'
import { PrismaService } from '../../prisma.service'
import { WhatsAppConversationMapper } from '../mappers/whatsapp-conversation-mapper'

@Injectable()
export class PrismaWhatsAppConversationRepository extends WhatsAppConversationRepository {
  constructor(
    @Inject(PrismaService)
    private prisma: PrismaService,
  ) {
    super()
  }

  async findByPhoneNumberAndFranchiseId(phoneNumber: string, franchiseId: string): Promise<WhatsAppConversation | null> {
    const raw = await this.prisma.whatsAppConversation.findUnique({
      where: { phoneNumber_franchiseId: { phoneNumber, franchiseId } },
    })
    if (!raw) return null
    return WhatsAppConversationMapper.toDomain(raw)
  }

  async save(conversation: WhatsAppConversation): Promise<void> {
    const data = WhatsAppConversationMapper.toPrisma(conversation)
    await this.prisma.whatsAppConversation.upsert({
      where: {
        phoneNumber_franchiseId: {
          phoneNumber: conversation.phoneNumber,
          franchiseId: conversation.franchiseId.toString(),
        },
      },
      create: data,
      update: {
        step: data.step,
        patientId: data.patientId,
        professionalId: data.professionalId,
        selectedDate: data.selectedDate,
        expiresAt: data.expiresAt,
      },
    })
  }

  async delete(phoneNumber: string, franchiseId: string): Promise<void> {
    await this.prisma.whatsAppConversation.deleteMany({
      where: { phoneNumber, franchiseId },
    })
  }
}
