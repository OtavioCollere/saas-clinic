export class InventoryItemNotFoundError extends Error {
  constructor() {
    super("Insumo não encontrado.");
    this.name = "InventoryItemNotFoundError";
  }
}
