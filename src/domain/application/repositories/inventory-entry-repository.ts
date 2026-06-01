import type { InventoryEntry } from "@/domain/enterprise/entities/inventory-entry";

export abstract class InventoryEntryRepository {
  abstract create(entry: InventoryEntry): Promise<InventoryEntry>;
}
