import type { FranchiseRepository } from '../../src/domain/application/repositories/franchise-repository';
import type { Franchise } from '../../src/domain/enterprise/entities/franchise';

export class InMemoryFranchiseRepository implements FranchiseRepository {
  public items: Franchise[] = [];

  async create(franchise: Franchise): Promise<Franchise> {
    this.items.push(franchise);
    return franchise;
  }

  async findById(id: string): Promise<Franchise | null> {
    const franchise = this.items.find((item) => item.id.toString() === id);

    if (!franchise) return null;

    return franchise;
  }

  async findByClinicId(clinicId: string): Promise<Franchise[]> {
    return this.items.filter((item) => item.clinicId.toString() === clinicId);
  }

  async update(franchise: Franchise): Promise<Franchise> {
    const index = this.items.findIndex((item) => item.id.toString() === franchise.id.toString());

    if (index === -1) {
      throw new Error('Franchise not found');
    }

    this.items[index] = franchise;
    return franchise;
  }
}

