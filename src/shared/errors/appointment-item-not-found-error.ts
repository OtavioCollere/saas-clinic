export class AppointmentItemNotFoundError extends Error {
  constructor() {
    super('One or more appointment items were not found');
  }
}
