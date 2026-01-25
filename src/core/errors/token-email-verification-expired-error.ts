export class InvalidTokenEmailVerificationError extends Error {
    constructor() {
      super('Invalid token email verification.');
    }
  }