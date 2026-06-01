import { InventoryMovement } from "@/domain/enterprise/entities/inventory-movement";
import { UniqueEntityId } from "@/shared/entities/unique-entity-id";
import type { Decimal } from "@prisma/client/runtime/library";

type Raw = {
  id: string;
  clinicId: string;
  inventoryItemId: string;
  type: string;
  quantity: Decimal | number | string;
  unitCost: Decimal | number | string | null;
  reason: string | null;
  appointmentId: string | null;
  serviceOrderId: string | null;
  inventoryEntryId: string | null;
  professionalId: string | null;
  franchiseId: string | null;
  createdBy: string;
  createdAt: Date;
};

const toNum = (v: Decimal | number | string | null) =>
  v == null ? undefined : typeof v === "number" ? v : parseFloat(String(v));

export class InventoryMovementMapper {
  static toDomain(raw: Raw): InventoryMovement {
    return InventoryMovement.create(
      {
        clinicId: new UniqueEntityId(raw.clinicId),
        inventoryItemId: new UniqueEntityId(raw.inventoryItemId),
        type: raw.type,
        quantity: toNum(raw.quantity)!,
        unitCost: toNum(raw.unitCost),
        reason: raw.reason ?? undefined,
        appointmentId: raw.appointmentId ?? undefined,
        serviceOrderId: raw.serviceOrderId ?? undefined,
        inventoryEntryId: raw.inventoryEntryId ?? undefined,
        professionalId: raw.professionalId ?? undefined,
        franchiseId: raw.franchiseId ?? undefined,
        createdBy: raw.createdBy,
        createdAt: raw.createdAt,
      },
      new UniqueEntityId(raw.id),
    );
  }

  static toPrismaCreate(movement: InventoryMovement) {
    return {
      id: movement.id.toString(),
      clinicId: movement.clinicId.toString(),
      inventoryItem: { connect: { id: movement.inventoryItemId.toString() } },
      type: movement.type,
      quantity: movement.quantity,
      unitCost: movement.unitCost ?? null,
      reason: movement.reason ?? null,
      appointmentId: movement.appointmentId ?? null,
      serviceOrderId: movement.serviceOrderId ?? null,
      inventoryEntry: movement.inventoryEntryId
        ? { connect: { id: movement.inventoryEntryId } }
        : undefined,
      professionalId: movement.professionalId ?? null,
      franchiseId: movement.franchiseId ?? null,
      createdBy: movement.createdBy,
      createdAt: movement.createdAt,
    };
  }
}
