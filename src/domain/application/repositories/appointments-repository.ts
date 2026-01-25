import type { Appointment } from '@/domain/enterprise/entities/appointment';

export abstract class AppointmentsRepository {
  abstract create(appointment: Appointment): Promise<Appointment>;
  abstract findByProfessionalIdAndHourRange(professionalId: string, startAt: Date, endAt: Date): Promise<Appointment | null>;
  abstract findPendingByClinicId(clinicId: string): Promise<Appointment[]>;
  abstract findPendingByFranchiseId(franchiseId: string): Promise<Appointment[]>;
}
