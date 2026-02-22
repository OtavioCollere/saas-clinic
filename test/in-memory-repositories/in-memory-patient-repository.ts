import type { PaginationParams } from '@/shared/types/pagination-params';
import type { PatientRepository, PatientWithUserData } from '../../src/domain/application/repositories/patient-repository';
import type { Patient } from '../../src/domain/enterprise/entities/patient';

export class InMemoryPatientRepository implements PatientRepository {
  public items: Patient[] = [];

  async create(patient: Patient, tx?: unknown): Promise<Patient> {
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

  async fetchByClinicId(clinicId: string, { page, pageSize, query }: PaginationParams): Promise<PatientWithUserData[]> {
    const filtered = this.items.filter((item) => {
      if (item.clinicId.toString() !== clinicId) return false;
      if (!query) return true;
      return item.name.toLowerCase().includes(query.toLowerCase());
    });

    const start = (page - 1) * pageSize;
    const end = start + pageSize;

    const paginated = filtered.slice(start, end);

    // Para testes, retornar dados mockados do User, Franchise e Anamnesis
    // Em testes reais, você pode injetar um InMemoryUsersRepository se necessário
    return paginated.map((patient) => ({
      patient,
      userData: {
        cpf: '000.000.000-00', // Mock data para testes
        email: 'test@example.com', // Mock data para testes
        isEmailVerified: false, // Mock data para testes
      },
      franchiseName: undefined, // Mock data para testes
      franchiseId: undefined, // Mock data para testes
      anamneseId: undefined, // Mock data para testes
      isAnamneseDone: false, // Mock data para testes
    }));
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

