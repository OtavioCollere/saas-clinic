import type { PaginationParams } from '@/shared/types/pagination-params';
import type { Patient } from '@/domain/enterprise/entities/patient';

export interface PatientWithUserData {
  patient: Patient;
  userData: {
    cpf: string;
    email: string;
    isEmailVerified: boolean;
  };
  franchiseName?: string;
  franchiseId?: string;
  anamneseId?: string;
  isAnamneseDone: boolean;
}

export abstract class PatientRepository {
  abstract create(patient: Patient, tx?: unknown): Promise<Patient>;
  abstract findById(id: string): Promise<Patient | null>;
  abstract findByUserId(userId: string): Promise<Patient | null>;
  abstract findByClinicId(clinicId: string): Promise<Patient[]>;
  abstract fetchByClinicId(clinicId: string, { query, page, pageSize }: PaginationParams): Promise<PatientWithUserData[]>;
  abstract update(patient: Patient): Promise<Patient>;
  abstract fetch({ query, page, pageSize }: PaginationParams): Promise<Patient[]>;
}
