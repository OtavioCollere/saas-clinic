import type { PaginationParams } from '@/core/types/pagination-params';
import type { ClinicRepository } from '../../src/domain/application/repositories/clinic-repository';
import type { Clinic } from '../../src/domain/enterprise/entities/clinic';

export class InMemoryClinicRepository implements ClinicRepository {
  public items: Clinic[] = [];

async fetch({
  page,
  pageSize,
  query,
}: PaginationParams): Promise<Clinic[]> {
  const filtered = this.items.filter((item) => {
    if (!query) return true

    return item.name
      .toLowerCase()
      .includes(query.toLowerCase())
  })

  const start = (page - 1) * pageSize
  const end = start + pageSize

  return filtered.slice(start, end)
}


  async create(clinic: Clinic): Promise<Clinic> {
    this.items.push(clinic);
    return clinic;
  }

  async findById(id: string): Promise<Clinic | null> {
    const clinic = this.items.find((item) => item.id.toString() === id);

    if (!clinic) return null;

    return clinic;
  }

  async findBySlug(slug: string): Promise<Clinic | null> {
    const clinic = this.items.find((item) => item.slug.getValue() === slug);

    if (!clinic) return null;

    return clinic;
  }

  async findByOwnerId(ownerId: string): Promise<Clinic | null> {
    const clinic = this.items.find((item) => item.ownerId.toString() === ownerId);

    if (!clinic) return null;

    return clinic;
  }

  async update(clinic: Clinic): Promise<Clinic> {
    const index = this.items.findIndex((item) => item.id.toString() === clinic.id.toString());

    if (index === -1) {
      throw new Error('Clinic not found');
    }

    this.items[index] = clinic;
    return clinic;
  }

  async delete(id: string): Promise<void> {
    const index = this.items.findIndex((item) => item.id.toString() === id);

    if (index !== -1) {
      this.items.splice(index, 1);
    }
  }
}
