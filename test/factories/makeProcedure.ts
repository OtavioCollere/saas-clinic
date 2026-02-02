import { UniqueEntityId } from '@/shared/entities/unique-entity-id';
import type { ProcedureProps } from '@/domain/enterprise/entities/procedure';
import { Procedure } from '@/domain/enterprise/entities/procedure';
import { ProcedureStatus } from '@/domain/enterprise/value-objects/procedure-status';

export function makeProcedure(override: Partial<ProcedureProps> = {}): Procedure {
  const procedure = Procedure.create({
    franchiseId: new UniqueEntityId(),
    name: 'Procedure Name',
    price: 100.0,
    notes: 'Procedure notes',
    status: ProcedureStatus.active(),
    ...override,
  });

  return procedure;
}
