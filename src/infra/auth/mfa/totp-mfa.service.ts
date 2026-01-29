import { authenticator } from 'otplib'
import crypto from 'crypto'
import { MfaService } from '@/domain/services/mfa-service'

export class TotpMfaService extends MfaService {

  generateTotpSecret(): string {
    return authenticator.generateSecret()
  }

  verifyTotp(code: string, secret: string): boolean {
    return authenticator.verify({
      token: code,
      secret,
    })
  }

  generateBackupCodes() {
    const plainCodes: string[] = []
    const hashedCodes: string[] = []

    for (let i = 0; i < 8; i++) {
      const code = crypto.randomBytes(4).toString('hex')
      plainCodes.push(code)
      hashedCodes.push(this.hashBackupCode(code))
    }

    return { plainCodes, hashedCodes }
  }

  hashBackupCode(code: string): string {
    return crypto
      .createHash('sha256')
      .update(code)
      .digest('hex')
  }
}
