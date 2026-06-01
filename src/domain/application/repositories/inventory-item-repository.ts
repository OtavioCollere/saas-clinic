import type { InventoryItem } from "@/domain/enterprise/entities/inventory-item";

export abstract class InventoryItemRepository {
  abstract create(item: InventoryItem): Promise<InventoryItem>;
  abstract findById(id: string): Promise<InventoryItem | null>;
  abstract findByClinicId(clinicId: string): Promise<InventoryItem[]>;
  abstract findByIds(ids: string[]): Promise<InventoryItem[]>;
  abstract update(item: InventoryItem): Promise<void>;
}
