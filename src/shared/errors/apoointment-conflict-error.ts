export class AppointmentConflictError extends Error {
  constructor(appointmentDate: Date) {
    super(`There is already an appointment scheduled for this date at${appointmentDate.toISOString()}`);
  }
}