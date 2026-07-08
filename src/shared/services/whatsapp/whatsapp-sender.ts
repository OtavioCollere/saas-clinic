export interface ZApiCredentials {
  instanceId: string
  token: string
  clientToken?: string
}

export abstract class WhatsAppSender {
  abstract send(data: { to: string; message: string; credentials?: ZApiCredentials }): Promise<void>
}
