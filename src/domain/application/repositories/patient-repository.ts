import type { PaginationParams } from '@/shared/types/pagination-params';
import type { Patient } from '@/domain/enterprise/entities/patient';

export abstract class PatientRepository {
  abstract create(patient: Patient): Promise<Patient>;
  abstract findById(id: string): Promise<Patient | null>;
  abstract findByUserId(userId: string): Promise<Patient | null>;
  abstract findByClinicId(clinicId: string): Promise<Patient[]>;
  abstract update(patient: Patient): Promise<Patient>;
  abstract fetch({ query, page, pageSize }: PaginationParams): Promise<Patient[]>;
}
