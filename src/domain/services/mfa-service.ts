export abstract class MfaService {
    abstract generateTotpSecret(): string;
    abstract generateBackupCodes(): {
      plainCodes: string[];
      hashedCodes: string[];
    };
    abstract verifyTotp(code: string, secret: string): boolean;
    abstract hashBackupCode(code: string): string;
  }
  