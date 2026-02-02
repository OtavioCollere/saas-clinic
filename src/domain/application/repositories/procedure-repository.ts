import type { Procedure } from '@/domain/enterprise/entities/procedure';

export abstract class ProcedureRepository {
  abstract create(procedure: Procedure): Promise<Procedure>;
  abstract findById(id: string): Promise<Procedure | null>;
  abstract findByFranchiseId(franchiseId: string): Promise<Procedure[]>;
  abstract update(procedure: Procedure): Promise<Procedure>;
}
