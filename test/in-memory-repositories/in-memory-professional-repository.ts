import type { ProfessionalRepository } from '../../src/domain/application/repositories/professional-repository';
import type { Professional } from '../../src/domain/enterprise/entities/professional';

export class InMemoryProfessionalRepository implements ProfessionalRepository {
  public items: Professional[] = [];

  async create(professional: Professional): Promise<Professional> {
    this.items.push(professional);
    return professional;
  }

  async findById(id: string): Promise<Professional | null> {
    const professional = this.items.find((item) => item.id.toString() === id);

    if (!professional) return null;

    return professional;
  }

  async findByUserIdAndFranchiseId(userId: string, franchiseId: string): Promise<Professional | null> {
    const professional = this.items.find(
      (item) => item.userId.toString() === userId && item.franchiseId.toString() === franchiseId
    );

    if (!professional) return null;

    return professional;
  }

  async findByFranchiseId(franchiseId: string): Promise<Professional[]> {
    return this.items.filter((item) => item.franchiseId.toString() === franchiseId);
  }

  async update(professional: Professional): Promise<Professional> {
    const index = this.items.findIndex((item) => item.id.toString() === professional.id.toString());

    if (index === -1) {
      throw new Error('Professional not found');
    }

    this.items[index] = professional;
    return professional;
  }
}

