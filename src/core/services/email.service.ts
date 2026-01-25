
export interface EmailService {
    sendEmailVerification(params: {
      to: string
      token: string
    }): Promise<void>
  }
  