export class ClinicHasPendingAppointmentsError extends Error {
  constructor() {
    super('Clinic has pending appointments');
  }
}
