export class AppointmentConflictError extends Error {
  constructor(startAt?: Date, endAt?: Date) {
    if (startAt && endAt) {
      const dateStr = startAt.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
      const startTime = startAt.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
      const endTime = endAt.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
      super(`Já existe uma consulta agendada em ${dateStr} das ${startTime} às ${endTime}. Escolha outro horário.`);
    } else if (startAt) {
      const formatted = startAt.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
      super(`Já existe uma consulta agendada para ${formatted}. Escolha outro horário.`);
    } else {
      super("O profissional já possui uma consulta agendada neste horário.");
    }
  }
}
