import type { ProcedureRepository } from '../../src/domain/application/repositories/procedure-repository';
import type { Procedure } from '../../src/domain/enterprise/entities/procedure';

export class InMemoryProcedureRepository implements ProcedureRepository {
  public items: Procedure[] = [];
  public clinicFranchisesMap: Map<string, string[]> = new Map();

  async create(procedure: Procedure): Promise<Procedure> {
    this.items.push(procedure);
    return procedure;
  }

  async findById(id: string): Promise<Procedure | null> {
    const procedure = this.items.find((item) => item.id.toString() === id);
    return procedure || null;
  }

  async findByFranchiseId(franchiseId: string): Promise<Procedure[]> {
    return this.items.filter((item) => item.franchiseId.toString() === franchiseId);
  }

  async findByClinicId(clinicId: string): Promise<Procedure[]> {
    const franchiseIds = this.clinicFranchisesMap.get(clinicId) ?? [];
    return this.items.filter((item) =>
      franchiseIds.includes(item.franchiseId.toString())
    );
  }

  async update(procedure: Procedure): Promise<Procedure> {
    const index = this.items.findIndex((item) => item.id.toString() === procedure.id.toString());

    if (index === -1) {
      throw new Error('Procedure not found');
    }

    this.items[index] = procedure;
    return procedure;
  }

  async hasAppointments(_procedureId: string): Promise<boolean> {
    return false;
  }

  async delete(procedureId: string): Promise<void> {
    this.items = this.items.filter((item) => item.id.toString() !== procedureId);
  }
}
