export class AppointmentInPastError extends Error {
  constructor() {
    super("Nao e possivel agendar uma consulta em uma data ou horario que ja passou.");
  }
}
