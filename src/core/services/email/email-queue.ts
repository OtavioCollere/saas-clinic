export abstract class EmailQueue {
  abstract enqueue(data: {
    to: string
    subject: string
    text?: string
    html?: string
  }): Promise<void>
}

