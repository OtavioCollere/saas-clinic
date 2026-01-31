export class MfaAlreadyEnabledError extends Error {
    constructor() {
      super('MFA already enabled');
    }
  }