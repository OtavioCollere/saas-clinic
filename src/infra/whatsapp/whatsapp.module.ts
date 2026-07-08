import { Module } from '@nestjs/common'
import { BullModule } from '@nestjs/bull'
import { DatabaseModule } from '../database/database.module'
import { WhatsAppSender } from '@/shared/services/whatsapp/whatsapp-sender'
import { WhatsAppQueue } from '@/shared/services/whatsapp/whatsapp-queue'
import { ZApiWhatsAppSender } from './zapi-whatsapp-sender'
import { BullWhatsAppQueue } from './bull-whatsapp-queue'
import { SendWhatsAppConsumer } from './consumers/send-whatsapp.consumer'

@Module({
  imports: [
    BullModule.registerQueue({ name: 'SEND_WHATSAPP_QUEUE' }),
    DatabaseModule,
  ],
  providers: [
    { provide: WhatsAppSender, useClass: ZApiWhatsAppSender },
    { provide: WhatsAppQueue, useClass: BullWhatsAppQueue },
    SendWhatsAppConsumer,
  ],
  exports: [WhatsAppSender, WhatsAppQueue],
})
export class WhatsAppModule {}
