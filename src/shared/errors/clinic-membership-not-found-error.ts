export class ClinicMembershipNotFoundError extends Error {
  constructor() {
    super('User is not a member of this clinic');
  }
}

