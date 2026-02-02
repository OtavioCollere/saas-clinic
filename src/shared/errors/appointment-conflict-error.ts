export class AppointmentConflictError extends Error {
  constructor(appointmentDate?: Date) {
    if (appointmentDate) {
      super(`There is already an appointment scheduled for this date at ${appointmentDate.toISOString()}`);
    } else {
      super('Appointment conflict: professional already has an appointment at this time');
    }
  }
}

