export class InvalidTotpCodeError extends Error {
    constructor() {
      super('Invalid TOTP code');
    }
  }