export class ProcedureHasAppointmentsError extends Error {
  constructor() {
    super('Cannot delete procedure: it is linked to one or more appointments');
  }
}



