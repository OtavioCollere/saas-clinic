export class ClinicAlreadyExistsError extends Error {
  constructor() {
    super('Clinic already exists');
  }
}