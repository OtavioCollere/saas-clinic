import type { Appointment } from '@/domain/enterprise/entities/appointment';

export abstract class AppointmentsRepository {
  abstract create(appointment: Appointment): Promise<Appointment>;
  abstract findById(id: string): Promise<Appointment | null>;
  abstract findByProfessionalId(professionalId: string): Promise<Appointment[]>;
  abstract findByPatientId(patientId: string): Promise<Appointment[]>;
  abstract findByProfessionalIdAndHourRange(professionalId: string, startAt: Date, endAt: Date): Promise<Appointment | null>;
  abstract findPendingByClinicId(clinicId: string): Promise<Appointment[]>;
  abstract findPendingByFranchiseId(franchiseId: string): Promise<Appointment[]>;
  abstract update(appointment: Appointment): Promise<Appointment>;
}
