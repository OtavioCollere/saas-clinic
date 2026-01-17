import type { Appointment } from '@/domain/enterprise/entities/appointment';
export declare abstract class AppointmentsRepository {
    abstract findPendingByClinicId(clinicId: string): Promise<Appointment[]>;
    abstract findPendingByFranchiseId(franchiseId: string): Promise<Appointment[]>;
}
