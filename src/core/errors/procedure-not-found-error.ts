export class ProcedureNotFoundError extends Error {
  constructor() {
    super('Procedure not found');
  }
}
