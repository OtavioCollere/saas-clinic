export class ClinicNotFoundError extends Error {
  constructor() {
    super('Clinic not found');
  }
}
