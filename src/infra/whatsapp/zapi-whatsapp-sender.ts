import { Injectable, Logger } from '@nestjs/common'
import { WhatsAppSender } from '@/shared/services/whatsapp/whatsapp-sender'

@Injectable()
export class ZApiWhatsAppSender extends WhatsAppSender {
  private readonly logger = new Logger(ZApiWhatsAppSender.name)

  async send({ to, message }: { to: string; message: string }): Promise<void> {
    const instanceId = process.env.ZAPI_INSTANCE_ID
    const token = process.env.ZAPI_TOKEN

    const phone = to.replace(/\D/g, '')

    const url = `https://api.z-api.io/instances/${instanceId}/token/${token}/send-text`

    const headers: Record<string, string> = { 'Content-Type': 'application/json' }
    if (process.env.ZAPI_CLIENT_TOKEN) {
      headers['Client-Token'] = process.env.ZAPI_CLIENT_TOKEN
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({ phone, message }),
    })

    if (!response.ok) {
      const body = await response.text()
      this.logger.error(`Erro ao enviar mensagem WhatsApp para ${phone}: ${body}`)
      throw new Error(`Z-API error: ${response.status}`)
    }

    this.logger.log(`Mensagem WhatsApp enviada para ${phone}`)
  }
}
