import { Entity } from "@/shared/entities/entity";
import { UniqueEntityId } from "@/shared/entities/unique-entity-id";

export interface InventoryMovementProps {
  clinicId: UniqueEntityId;
  inventoryItemId: UniqueEntityId;
  type: string; // ENTRADA | SAIDA | AJUSTE_POSITIVO | AJUSTE_NEGATIVO | CANCELAMENTO
  quantity: number;
  unitCost?: number;
  reason?: string;
  appointmentId?: string;
  serviceOrderId?: string;
  inventoryEntryId?: string;
  professionalId?: string;
  franchiseId?: string;
  createdBy: string;
  createdAt: Date;
}

export class InventoryMovement extends Entity<InventoryMovementProps> {
  static create(props: Omit<InventoryMovementProps, "createdAt"> & Partial<Pick<InventoryMovementProps, "createdAt">>, id?: UniqueEntityId) {
    return new InventoryMovement(
      { ...props, createdAt: props.createdAt ?? new Date() },
      id,
    );
  }

  get clinicId() { return this.props.clinicId; }
  get inventoryItemId() { return this.props.inventoryItemId; }
  get type() { return this.props.type; }
  get quantity() { return this.props.quantity; }
  get unitCost() { return this.props.unitCost; }
  get reason() { return this.props.reason; }
  get appointmentId() { return this.props.appointmentId; }
  get serviceOrderId() { return this.props.serviceOrderId; }
  get inventoryEntryId() { return this.props.inventoryEntryId; }
  get professionalId() { return this.props.professionalId; }
  get franchiseId() { return this.props.franchiseId; }
  get createdBy() { return this.props.createdBy; }
  get createdAt() { return this.props.createdAt; }
}
