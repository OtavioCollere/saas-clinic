import type { ProcedureSupplyTemplate } from "@/domain/enterprise/entities/procedure-supply-template";

export class ProcedureSupplyTemplatePresenter {
  static toHTTP(template: ProcedureSupplyTemplate) {
    return {
      id: template.id.toString(),
      clinicId: template.clinicId.toString(),
      procedureId: template.procedureId.toString(),
      inventoryItemId: template.inventoryItemId.toString(),
      defaultQuantity: template.defaultQuantity,
      isRequired: template.isRequired,
      active: template.active,
      createdAt: template.createdAt,
    };
  }
}
