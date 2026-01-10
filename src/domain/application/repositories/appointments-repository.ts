import type { Appointment } from '@/domain/enterprise/entities/appointment';

export abstract class AppointmentsRepository {
  abstract findPendingByClinicId(clinicId: string): Promise<Appointment[]>;
  abstract findPendingByFranchiseId(franchiseId: string): Promise<Appointment[]>;
}
