export interface MfaService {
    generateTotpSecret(): string;
    generateBackupCodes(): {
      plainCodes: string[];
      hashedCodes: string[];
    };
    verifyTotp(code: string, secret: string): boolean;
    hashBackupCode(code: string): string;
  }
  