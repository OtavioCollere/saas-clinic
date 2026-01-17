import type { AnamnesisRepository } from '../../src/domain/application/repositories/anamnesis-repository';
import type { Anamnesis } from '../../src/domain/enterprise/entities/anamnesis/anamnesis';

export class InMemoryAnamnesisRepository implements AnamnesisRepository {
  public items: Anamnesis[] = [];

  async create(anamnesis: Anamnesis): Promise<Anamnesis> {
    this.items.push(anamnesis);
    return anamnesis;
  }

  async findById(id: string): Promise<Anamnesis | null> {
    const anamnesis = this.items.find((item) => item.id.toString() === id);

    if (!anamnesis) return null;

    return anamnesis;
  }

  async findByPatientId(patientId: string): Promise<Anamnesis | null> {
    const anamnesis = this.items.find((item) => item.patientId.toString() === patientId);

    if (!anamnesis) return null;

    return anamnesis;
  }

  async update(anamnesis: Anamnesis): Promise<Anamnesis> {
    const index = this.items.findIndex((item) => item.id.toString() === anamnesis.id.toString());

    if (index === -1) {
      throw new Error('Anamnesis not found');
    }

    this.items[index] = anamnesis;
    return anamnesis;
  }
}

