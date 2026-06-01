import { Entity } from "@/shared/entities/entity";
import { UniqueEntityId } from "@/shared/entities/unique-entity-id";

export interface InventoryEntryProps {
  clinicId: UniqueEntityId;
  inventoryItemId: UniqueEntityId;
  quantity: number;
  unitCost: number;
  totalCost: number;
  supplier?: string;
  batchNumber?: string;
  expirationDate?: Date;
  notes?: string;
  createdBy: string;
  createdAt: Date;
}

export class InventoryEntry extends Entity<InventoryEntryProps> {
  static create(props: Omit<InventoryEntryProps, "createdAt" | "totalCost"> & Partial<Pick<InventoryEntryProps, "createdAt" | "totalCost">>, id?: UniqueEntityId) {
    return new InventoryEntry(
      {
        ...props,
        totalCost: props.totalCost ?? props.quantity * props.unitCost,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );
  }

  get clinicId() { return this.props.clinicId; }
  get inventoryItemId() { return this.props.inventoryItemId; }
  get quantity() { return this.props.quantity; }
  get unitCost() { return this.props.unitCost; }
  get totalCost() { return this.props.totalCost; }
  get supplier() { return this.props.supplier; }
  get batchNumber() { return this.props.batchNumber; }
  get expirationDate() { return this.props.expirationDate; }
  get notes() { return this.props.notes; }
  get createdBy() { return this.props.createdBy; }
  get createdAt() { return this.props.createdAt; }
}
