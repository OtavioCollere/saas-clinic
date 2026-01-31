export class MfaSettingsNotFoundError extends Error {
    constructor() {
      super('MFA settings not found');
    }
  }