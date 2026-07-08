import type { Appointment } from '@/domain/enterprise/entities/appointment';
import type { AppointmentItem } from '@/domain/enterprise/entities/appointment-item';

export abstract class AppointmentsRepository {
  abstract create(appointment: Appointment): Promise<Appointment>;
  abstract findById(id: string): Promise<Appointment | null>;
  abstract findByAppointmentItemIds(ids: string[]): Promise<AppointmentItem[]>;
  abstract findByProfessionalId(professionalId: string, options?: { period?: 'active' | 'history' }): Promise<Appointment[]>;
  abstract findByPatientId(patientId: string, options?: { period?: 'active' | 'history' }): Promise<Appointment[]>;
  abstract findByProfessionalIdAndHourRange(professionalId: string, startAt: Date, endAt: Date): Promise<Appointment | null>;
  abstract findByProfessionalIdAndHourRangeExcludingId(professionalId: string, startAt: Date, endAt: Date, excludeId: string): Promise<Appointment | null>;
  abstract findPendingByClinicId(clinicId: string): Promise<Appointment[]>;
  abstract findPendingByFranchiseId(franchiseId: string): Promise<Appointment[]>;
  abstract findPendingByProfessionalId(professionalId: string): Promise<Appointment[]>;
  abstract findByClinicId(clinicId: string): Promise<Appointment[]>;
  /** Agendamentos futuros (endAt >= now), ordenados do próximo para o mais distante (startAt asc) */
  abstract findFutureByClinicId(clinicId: string): Promise<Appointment[]>;
  /** Histórico (endAt < now), ordenado do mais recente para o mais antigo (startAt desc), com paginação */
  abstract findHistoryByClinicIdPaginated(
    clinicId: string,
    page: number,
    perPage: number
  ): Promise<{ appointments: Appointment[]; total: number }>;
  abstract findByClinicIdAndWeek(clinicId: string, weekStart: Date, weekEnd: Date): Promise<Appointment[]>;
  abstract update(appointment: Appointment): Promise<Appointment>;
  abstract countByClinicIdAndDateRange(clinicId: string, start: Date, end: Date): Promise<number>;
  abstract sumItemsPriceByClinicIdAndDateRange(clinicId: string, start: Date, end: Date): Promise<number>;
  abstract markAsDone(appointmentId: string): Promise<void>;
  abstract findActiveForDate(date: Date): Promise<Appointment[]>;
}
