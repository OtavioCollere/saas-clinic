import { MfaService } from "@/domain/services/mfa-service";

export class FakeMfaService implements MfaService {
    private totpVerificationResults: Map<string, boolean> = new Map();
    private generatedSecrets: string[] = [];

    generateTotpSecret(): string {
        const secret = `fake-secret-${Date.now()}`;
        this.generatedSecrets.push(secret);
        return secret;
    }

    generateBackupCodes(): {
        plainCodes: string[];
        hashedCodes: string[];
    } {
        const codes = Array.from({ length: 10 }, (_, i) => `BACKUP${i + 1}`);
        return {
            plainCodes: codes,
            hashedCodes: codes.map(code => `hashed-${code}`),
        };
    }

    verifyTotp(code: string, secret: string): boolean {
        const key = `${code}-${secret}`;
        return this.totpVerificationResults.get(key) ?? false;
    }

    hashBackupCode(code: string): string {
        return `hashed-${code}`;
    }

    // Helper methods for testing
    setTotpVerificationResult(code: string, secret: string, isValid: boolean): void {
        const key = `${code}-${secret}`;
        this.totpVerificationResults.set(key, isValid);
    }

    clearTotpVerificationResults(): void {
        this.totpVerificationResults.clear();
    }
}

