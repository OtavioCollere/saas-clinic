import type { PaginationParams } from '@/shared/types/pagination-params';
import type { PatientRepository } from '../../src/domain/application/repositories/patient-repository';
import type { Patient } from '../../src/domain/enterprise/entities/patient';

export class InMemoryPatientRepository implements PatientRepository {
  public items: Patient[] = [];

  async create(patient: Patient): Promise<Patient> {
    this.items.push(patient);
    return patient;
  }

  async findById(id: string): Promise<Patient | null> {
    const patient = this.items.find((item) => item.id.toString() === id);

    if (!patient) return null;

    return patient;
  }

  async findByUserId(userId: string): Promise<Patient | null> {
    const patient = this.items.find((item) => item.userId.toString() === userId);

    if (!patient) return null;

    return patient;
  }

  async findByClinicId(clinicId: string): Promise<Patient[]> {
    return this.items.filter((item) => item.clinicId.toString() === clinicId);
  }

  async update(patient: Patient): Promise<Patient> {
    const index = this.items.findIndex((item) => item.id.toString() === patient.id.toString());

    if (index === -1) {
      throw new Error('Patient not found');
    }

    this.items[index] = patient;
    return patient;
  }

  async fetch({ page, pageSize, query }: PaginationParams): Promise<Patient[]> {
    const filtered = this.items.filter((item) => {
      if (!query) return true;

      return item.name.toLowerCase().includes(query.toLowerCase());
    });

    const start = (page - 1) * pageSize;
    const end = start + pageSize;

    return filtered.slice(start, end);
  }
}

