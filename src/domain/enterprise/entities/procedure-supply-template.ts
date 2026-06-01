import { Entity } from "@/shared/entities/entity";
import { UniqueEntityId } from "@/shared/entities/unique-entity-id";

export interface ProcedureSupplyTemplateProps {
  clinicId: UniqueEntityId;
  procedureId: UniqueEntityId;
  inventoryItemId: UniqueEntityId;
  defaultQuantity: number;
  isRequired: boolean;
  active: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

export class ProcedureSupplyTemplate extends Entity<ProcedureSupplyTemplateProps> {
  static create(props: Omit<ProcedureSupplyTemplateProps, "createdAt" | "active" | "isRequired"> & Partial<Pick<ProcedureSupplyTemplateProps, "createdAt" | "active" | "isRequired">>, id?: UniqueEntityId) {
    return new ProcedureSupplyTemplate(
      {
        ...props,
        isRequired: props.isRequired ?? true,
        active: props.active ?? true,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );
  }

  get clinicId() { return this.props.clinicId; }
  get procedureId() { return this.props.procedureId; }
  get inventoryItemId() { return this.props.inventoryItemId; }
  get defaultQuantity() { return this.props.defaultQuantity; }
  get isRequired() { return this.props.isRequired; }
  get active() { return this.props.active; }
  get createdAt() { return this.props.createdAt; }
  get updatedAt() { return this.props.updatedAt; }

  update(data: Partial<Pick<ProcedureSupplyTemplateProps, "defaultQuantity" | "isRequired" | "active">>) {
    Object.assign(this.props, data);
    this.props.updatedAt = new Date();
  }
}
