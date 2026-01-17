export class PatientNotFoundError extends Error {
  constructor() {
    super('Patient not found');
  }
}
