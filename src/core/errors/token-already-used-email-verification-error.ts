export class TokenAlreadyUsedEmailVerificationError extends Error {
    constructor() {
      super('Token already used in email verification.');
    }
  }