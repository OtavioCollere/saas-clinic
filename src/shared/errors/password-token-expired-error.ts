export class PasswordTokenExpiredError extends Error {
  constructor() {
    super('Password verification token has expired');
  }
}


