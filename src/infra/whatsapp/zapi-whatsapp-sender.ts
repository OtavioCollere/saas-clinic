import { Injectable, Logger } from '@nestjs/common'
import { WhatsAppSender, type ZApiCredentials } from '@/shared/services/whatsapp/whatsapp-sender'

@Injectable()
export class ZApiWhatsAppSender extends WhatsAppSender {
  private readonly logger = new Logger(ZApiWhatsAppSender.name)

  async send({ to, message, credentials }: { to: string; message: string; credentials?: ZApiCredentials }): Promise<void> {
    const instanceId = credentials?.instanceId ?? process.env.ZAPI_INSTANCE_ID
    const token = credentials?.token ?? process.env.ZAPI_TOKEN
    const clientToken = credentials?.clientToken ?? process.env.ZAPI_CLIENT_TOKEN

    if (!instanceId || !token) {
      this.logger.warn(`WhatsApp não configurado para este destino (${to}) — credenciais ausentes`)
      return
    }

    const phone = to.replace(/\D/g, '')
    const url = `https://api.z-api.io/instances/${instanceId}/token/${token}/send-text`

    const headers: Record<string, string> = { 'Content-Type': 'application/json' }
    if (clientToken) {
      headers['Client-Token'] = clientToken
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
