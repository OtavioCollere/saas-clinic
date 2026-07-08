export class ProcedureSupplyTemplateNotFoundError extends Error {
  constructor() {
    super("Template de insumo não encontrado.");
    this.name = "ProcedureSupplyTemplateNotFoundError";
  }
}
