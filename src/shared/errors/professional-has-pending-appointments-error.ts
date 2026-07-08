export class ProfessionalHasPendingAppointmentsError extends Error {
  constructor() {
    super('Professional has pending appointments. Reassign them before inactivating.');
  }
}
