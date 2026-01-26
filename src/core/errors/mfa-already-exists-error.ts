export class MfaAlreadyExistsError extends Error {
    constructor() {
      super('MFA already exists');
    }
  }