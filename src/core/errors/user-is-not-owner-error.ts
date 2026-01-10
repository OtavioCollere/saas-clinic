export class UserIsNotOwnerError extends Error {
  constructor() {
    super('User is not an owner');
  }
}
