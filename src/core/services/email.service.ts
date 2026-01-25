
export abstract class EmailService {
    abstract sendEmailVerification(params: {
      to: string
      token: string
    }): Promise<void>
  }
  