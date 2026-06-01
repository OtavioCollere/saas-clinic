import { Module } from '@nestjs/common'
import { WhatsAppSender } from '@/shared/services/whatsapp/whatsapp-sender'
import { ZApiWhatsAppSender } from './zapi-whatsapp-sender'

@Module({
  providers: [
    { provide: WhatsAppSender, useClass: ZApiWhatsAppSender },
  ],
  exports: [WhatsAppSender],
})
export class WhatsAppModule {}
