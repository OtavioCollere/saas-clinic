export type AnamnesisTokenErrorCode = 'NOT_FOUND' | 'EXPIRED' | 'ALREADY_USED' | 'INVALIDATED'

export class InvalidAnamnesisTokenError extends Error {
  readonly code: AnamnesisTokenErrorCode

  constructor(code: AnamnesisTokenErrorCode = 'NOT_FOUND') {
    super('Anamnesis token is invalid or expired')
    this.code = code
  }
}
