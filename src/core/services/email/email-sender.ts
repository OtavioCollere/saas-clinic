export abstract class EmailSender {
  abstract send(data: {
    to: string
    subject: string
    text?: string
    html?: string
  }): Promise<void>
}
