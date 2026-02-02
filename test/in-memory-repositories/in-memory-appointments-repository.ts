import { AppointmentStatus } from '@/domain/enterprise/value-objects/appointment-status';
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

  async findById(id: string): Promise<Appointment | null> {
    const appointment = this.items.find((item) => item.id.toString() === id);
    return appointment || null;
  }

  async findByProfessionalId(professionalId: string): Promise<Appointment[]> {
    return this.items.filter((appointment) => appointment.professionalId.toString() === professionalId);
  }

  async findByPatientId(patientId: string): Promise<Appointment[]> {
    return this.items.filter((appointment) => appointment.patientId.toString() === patientId);
  }

  async findByProfessionalIdAndHourRange(professionalId: string, startAt: Date, endAt: Date): Promise<Appointment | null> {
    const appointment = this.items.find((item) => {
      const sameProfessional = item.professionalId.toString() === professionalId;
      const overlaps = (item.startAt < endAt && item.endAt > startAt);
      return sameProfessional && overlaps;
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

  async update(appointment: Appointment): Promise<Appointment> {
    const index = this.items.findIndex((item) => item.id.toString() === appointment.id.toString());
    
    if (index === -1) {
      throw new Error('Appointment not found');
    }
    
    this.items[index] = appointment;
    return appointment;
  }
}
