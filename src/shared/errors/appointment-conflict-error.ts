export class AppointmentConflictError extends Error {
  constructor() {
    super('Appointment conflict: professional already has an appointment at this time');
  }
}

