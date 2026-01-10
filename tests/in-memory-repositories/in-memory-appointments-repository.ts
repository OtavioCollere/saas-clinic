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

  async findPendingByClinicId(clinicId: string): Promise<Appointment[]> {
    const franchiseIds = this.clinicFranchisesMap.get(clinicId) || [];

    return this.items.filter((appointment) => {
      const status = appointment.status;
      const isPending = status.isWaiting() || status.isConfirmed();
      const belongsToClinic = franchiseIds.includes(appointment.franchiseId.toString());

      return isPending && belongsToClinic;
    });
  }
}
