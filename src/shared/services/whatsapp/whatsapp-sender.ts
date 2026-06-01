export abstract class WhatsAppSender {
  abstract send(data: { to: string; message: string }): Promise<void>
}
