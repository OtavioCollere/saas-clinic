import type { ProcedureSupplyTemplate } from "@/domain/enterprise/entities/procedure-supply-template";

export abstract class ProcedureSupplyTemplateRepository {
  abstract upsert(template: ProcedureSupplyTemplate): Promise<ProcedureSupplyTemplate>;
  abstract findByProcedureId(procedureId: string): Promise<ProcedureSupplyTemplate[]>;
  abstract findByProcedureIds(procedureIds: string[]): Promise<ProcedureSupplyTemplate[]>;
  abstract findById(id: string): Promise<ProcedureSupplyTemplate | null>;
  abstract delete(id: string): Promise<void>;
}
