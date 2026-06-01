import { InventoryEntry } from "@/domain/enterprise/entities/inventory-entry";
import { UniqueEntityId } from "@/shared/entities/unique-entity-id";
import type { Decimal } from "@prisma/client/runtime/library";

type Raw = {
  id: string;
  clinicId: string;
  inventoryItemId: string;
  quantity: Decimal | number | string;
  unitCost: Decimal | number | string;
  totalCost: Decimal | number | string;
  supplier: string | null;
  batchNumber: string | null;
  expirationDate: Date | null;
  notes: string | null;
  createdBy: string;
  createdAt: Date;
};

const toNum = (v: Decimal | number | string) =>
  typeof v === "number" ? v : parseFloat(String(v));

export class InventoryEntryMapper {
  static toDomain(raw: Raw): InventoryEntry {
    return InventoryEntry.create(
      {
        clinicId: new UniqueEntityId(raw.clinicId),
        inventoryItemId: new UniqueEntityId(raw.inventoryItemId),
        quantity: toNum(raw.quantity),
        unitCost: toNum(raw.unitCost),
        totalCost: toNum(raw.totalCost),
        supplier: raw.supplier ?? undefined,
        batchNumber: raw.batchNumber ?? undefined,
        expirationDate: raw.expirationDate ?? undefined,
        notes: raw.notes ?? undefined,
        createdBy: raw.createdBy,
        createdAt: raw.createdAt,
      },
      new UniqueEntityId(raw.id),
    );
  }

  static toPrismaCreate(entry: InventoryEntry) {
    return {
      id: entry.id.toString(),
      clinicId: entry.clinicId.toString(),
      inventoryItem: { connect: { id: entry.inventoryItemId.toString() } },
      quantity: entry.quantity,
      unitCost: entry.unitCost,
      totalCost: entry.totalCost,
      supplier: entry.supplier ?? null,
      batchNumber: entry.batchNumber ?? null,
      expirationDate: entry.expirationDate ?? null,
      notes: entry.notes ?? null,
      createdBy: entry.createdBy,
      createdAt: entry.createdAt,
    };
  }
}
