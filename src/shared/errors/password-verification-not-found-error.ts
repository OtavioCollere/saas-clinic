export class PasswordVerificationNotFoundError extends Error {
  constructor() {
    super('Password verification token not found');
  }
}


