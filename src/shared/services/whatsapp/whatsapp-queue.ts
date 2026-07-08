import { ZApiCredentials } from './whatsapp-sender'

export abstract class WhatsAppQueue {
  abstract enqueue(data: {
    to: string
    message: string
    credentials?: ZApiCredentials
    logId?: string
  }): Promise<void>
}
