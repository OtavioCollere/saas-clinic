import type { InventoryMovement } from "@/domain/enterprise/entities/inventory-movement";

export abstract class InventoryMovementRepository {
  abstract create(movement: InventoryMovement): Promise<InventoryMovement>;
  abstract findByServiceOrderId(serviceOrderId: string): Promise<InventoryMovement[]>;
}
