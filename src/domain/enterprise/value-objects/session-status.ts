export enum SessionStatus {
    PENDING = 'PENDING',        // credenciais ok, MFA pendente
    ACTIVE = 'ACTIVE',          // login completo
    REVOKED = 'REVOKED',        // logout / revogada
    EXPIRED = 'EXPIRED',        // expirou por tempo
  }
  