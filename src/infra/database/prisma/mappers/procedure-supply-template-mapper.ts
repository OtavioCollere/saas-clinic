import { ProcedureSupplyTemplate } from "@/domain/enterprise/entities/procedure-supply-template";
import { UniqueEntityId } from "@/shared/entities/unique-entity-id";
import type { Decimal } from "@prisma/client/runtime/library";

type Raw = {
  id: string;
  clinicId: string;
  procedureId: string;
  inventoryItemId: string;
  defaultQuantity: Decimal | number | string;
  isRequired: boolean;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
};

const toNum = (v: Decimal | number | string) =>
  typeof v === "number" ? v : parseFloat(String(v));

export class ProcedureSupplyTemplateMapper {
  static toDomain(raw: Raw): ProcedureSupplyTemplate {
    return ProcedureSupplyTemplate.create(
      {
        clinicId: new UniqueEntityId(raw.clinicId),
        procedureId: new UniqueEntityId(raw.procedureId),
        inventoryItemId: new UniqueEntityId(raw.inventoryItemId),
        defaultQuantity: toNum(raw.defaultQuantity),
        isRequired: raw.isRequired,
        active: raw.active,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityId(raw.id),
    );
  }

  static toPrismaUpsert(template: ProcedureSupplyTemplate) {
    return {
      where: {
        procedureId_inventoryItemId: {
          procedureId: template.procedureId.toString(),
          inventoryItemId: template.inventoryItemId.toString(),
        },
      },
      create: {
        id: template.id.toString(),
        clinicId: template.clinicId.toString(),
        procedure: { connect: { id: template.procedureId.toString() } },
        inventoryItem: { connect: { id: template.inventoryItemId.toString() } },
        defaultQuantity: template.defaultQuantity,
        isRequired: template.isRequired,
        active: template.active,
        createdAt: template.createdAt,
      },
      update: {
        defaultQuantity: template.defaultQuantity,
        isRequired: template.isRequired,
        active: template.active,
        updatedAt: new Date(),
      },
    };
  }
}
