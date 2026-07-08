import { AppointmentStatus } from '@/domain/enterprise/value-objects/appointment-status';
import { AppointmentItem } from '@/domain/enterprise/entities/appointment-item';
import type { AppointmentsRepository } from '../../src/domain/application/repositories/appointments-repository';
import type { Appointment } from '../../src/domain/enterprise/entities/appointment';

export class InMemoryAppointmentsRepository implements AppointmentsRepository {
  public items: Appointment[] = [];
  private clinicFranchisesMap: Map<string, string[]> = new Map();

  // Helper method for tests: associate franchiseIds with a clinicId
  associateFranchisesToClinic(clinicId: string, franchiseIds: string[]): void {
    this.clinicFranchisesMap.set(clinicId, franchiseIds);
  }

  async create(appointment: Appointment): Promise<Appointment> {
    this.items.push(appointment);
    return appointment;
  }

  async findByAppointmentItemIds(ids: string[]): Promise<AppointmentItem[]> {
    if (ids.length === 0) return [];

    const found: AppointmentItem[] = [];
    for (const appointment of this.items) {
      for (const item of appointment.appointmentItems) {
        if (ids.includes(item.id.toString())) {
          found.push(item);
        }
      }
    }
    return found;
  }

  async findById(id: string): Promise<Appointment | null> {
    const appointment = this.items.find((item) => item.id.toString() === id);
    return appointment || null;
  }

  async findByProfessionalId(professionalId: string, options?: { period?: 'active' | 'history' }): Promise<Appointment[]> {
    let filtered = this.items.filter((appointment) => appointment.professionalId.toString() === professionalId);
    const now = new Date();
    if (options?.period === 'active') {
      filtered = filtered.filter((a) => a.endAt >= now);
    } else if (options?.period === 'history') {
      filtered = filtered.filter((a) => a.endAt < now);
    }
    return filtered;
  }

  async findByPatientId(patientId: string, options?: { period?: 'active' | 'history' }): Promise<Appointment[]> {
    let filtered = this.items.filter((appointment) => appointment.patientId.toString() === patientId);
    const now = new Date();
    if (options?.period === 'active') {
      filtered = filtered.filter((a) => a.endAt >= now);
    } else if (options?.period === 'history') {
      filtered = filtered.filter((a) => a.endAt < now);
    }
    return filtered;
  }

  async findByProfessionalIdAndHourRange(professionalId: string, startAt: Date, endAt: Date): Promise<Appointment | null> {
    const appointment = this.items.find((item) => {
      const sameProfessional = item.professionalId.toString() === professionalId;
      const overlaps = (item.startAt < endAt && item.endAt > startAt);
      return sameProfessional && overlaps;
    });
    return appointment || null;
  }

  async findByProfessionalIdAndHourRangeExcludingId(professionalId: string, startAt: Date, endAt: Date, excludeId: string): Promise<Appointment | null> {
    const appointment = this.items.find((item) => {
      const sameProfessional = item.professionalId.toString() === professionalId;
      const isNotExcluded = item.id.toString() !== excludeId;
      const overlaps = (item.startAt < endAt && item.endAt > startAt);
      return sameProfessional && isNotExcluded && overlaps;
    });
    return appointment || null;
  }

  async findPendingByClinicId(clinicId: string): Promise<Appointment[]> {
    const franchiseIds = this.clinicFranchisesMap.get(clinicId) || [];

    return this.items.filter((appointment) => {
      const status = appointment.status;
      const isPending = status.isWaiting() || status.isConfirmed();
      const belongsToClinic = franchiseIds.includes(appointment.franchiseId.toString());

      return isPending && belongsToClinic;
    });
  }

  async findPendingByFranchiseId(franchiseId: string): Promise<Appointment[]> {
    return this.items.filter((appointment) => {
      const status = appointment.status;
      const isPending = status.isWaiting() || status.isConfirmed();
      const belongsToFranchise = appointment.franchiseId.toString() === franchiseId;

      return isPending && belongsToFranchise;
    });
  }

  async findByClinicId(clinicId: string): Promise<Appointment[]> {
    const franchiseIds = this.clinicFranchisesMap.get(clinicId) || [];

    return this.items.filter((appointment) => {
      return franchiseIds.includes(appointment.franchiseId.toString());
    });
  }

  async findFutureByClinicId(clinicId: string): Promise<Appointment[]> {
    const franchiseIds = this.clinicFranchisesMap.get(clinicId) || [];
    const now = new Date();
    const filtered = this.items.filter(
      (a) =>
        franchiseIds.includes(a.franchiseId.toString()) && a.endAt >= now
    );
    return [...filtered].sort((a, b) => a.startAt.getTime() - b.startAt.getTime());
  }

  async findHistoryByClinicIdPaginated(
    clinicId: string,
    page: number,
    perPage: number
  ): Promise<{ appointments: Appointment[]; total: number }> {
    const franchiseIds = this.clinicFranchisesMap.get(clinicId) || [];
    const now = new Date();
    const filtered = this.items
      .filter(
        (a) =>
          franchiseIds.includes(a.franchiseId.toString()) && a.endAt < now
      )
      .sort((a, b) => b.startAt.getTime() - a.startAt.getTime());
    const total = filtered.length;
    const appointments = filtered.slice(
      (page - 1) * perPage,
      (page - 1) * perPage + perPage
    );
    return { appointments, total };
  }

  async findByClinicIdAndWeek(clinicId: string, weekStart: Date, weekEnd: Date): Promise<Appointment[]> {
    const franchiseIds = this.clinicFranchisesMap.get(clinicId) || [];

    return this.items.filter((appointment) => {
      const belongsToClinic = franchiseIds.includes(appointment.franchiseId.toString());
      const isInWeek = appointment.startAt >= weekStart && appointment.startAt <= weekEnd;
      
      return belongsToClinic && isInWeek;
    });
  }

  async update(appointment: Appointment): Promise<Appointment> {
    const index = this.items.findIndex((item) => item.id.toString() === appointment.id.toString());
    
    if (index === -1) {
      throw new Error('Appointment not found');
    }
    
    this.items[index] = appointment;
    return appointment;
  }
}
